#!/bin/bash

set -e

# GET CURRENT VERSION
CURRENT_BRANCH_VERSION=$(node -p "require('./package.json').version")

echo "Current version: v$CURRENT_BRANCH_VERSION"
echo previous=$CURRENT_BRANCH_VERSION >> $GITHUB_OUTPUT
echo version=$CURRENT_BRANCH_VERSION >> $GITHUB_OUTPUT

# GET LAST RELEASE VERSION AND COMMITS
git fetch --tags
LAST_RELEASE_TAG=$(git tag -l "v*" | sort -V | grep -E "^v[0-9]+(\.[0-9]+)*$" | tail -1)
if [ -z "$LAST_RELEASE_TAG" ]; then
  LAST_RELEASE_VERSION="0.0.0"
  echo "There is no last release, starting from v$LAST_RELEASE_VERSION"
  LAST_RELEASE_ID=$(git rev-list --max-parents=0 HEAD)
else
  LAST_RELEASE_VERSION=$(expr "$LAST_RELEASE_TAG" : "v\(.*\)")
  echo "Last released version: v$LAST_RELEASE_VERSION"
  LAST_RELEASE_ID=$LAST_RELEASE_TAG
fi

COMMITS=$(git log --pretty=format:"%B" "$LAST_RELEASE_ID"..)
if [ "$COMMITS" == "" ]; then
  echo "No changes from the last version ($LAST_RELEASE_VERSION). No version number change required."
  exit 0;
fi

# FIGURE OUT NEXT VERSION
if echo "$COMMITS" | grep -qE "^BREAKING[ -]CHANGE: "; then
	CURRENT_MAJOR=$(echo "$LAST_RELEASE_VERSION" | sed -E "s|^([0-9]+)\.([0-9]+)\.([0-9]+)|\1|")
	NEXT_VERSION=$(echo "$LAST_RELEASE_VERSION" | sed -E "s|([0-9]+)\.([0-9]+)\.([0-9]+)|$(( CURRENT_MAJOR + 1 )).0.0|")
elif echo "$COMMITS" | grep -qE "^feat: |^feat\(.*\): "; then
	CURRENT_MINOR=$(echo "$LAST_RELEASE_VERSION" | sed -E "s|^([0-9]+)\.([0-9]+)\.([0-9]+)|\2|")
	NEXT_VERSION=$(echo "$LAST_RELEASE_VERSION" | sed -E "s|([0-9]+)\.([0-9]+)\.([0-9]+)|\1.$(( CURRENT_MINOR + 1 )).0|")
else
	CURRENT_PATCH=$(echo "$LAST_RELEASE_VERSION" | sed -E "s|^([0-9]+)\.([0-9]+)\.([0-9]+)|\3|")
	NEXT_VERSION=$(echo "$LAST_RELEASE_VERSION" | sed -E "s|([0-9]+)\.([0-9]+)\.([0-9]+)|\1.\2.$(( CURRENT_PATCH + 1 ))|")
fi

versions=$(printf '%s\n%s' "$NEXT_VERSION" "$CURRENT_BRANCH_VERSION")
if [ "$NEXT_VERSION" == "$CURRENT_BRANCH_VERSION" ] || [ "$versions" == "$(sort -V <<< "$versions")" ]; then
	echo "Version is updated, no changes required!" >&2
	exit 0
fi

echo "Suggested new version: $NEXT_VERSION"
echo version=$NEXT_VERSION >> $GITHUB_OUTPUT

## UPDATE VERSION
npm version -no-git-tag-version --force $NEXT_VERSION
