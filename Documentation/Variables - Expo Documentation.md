```
jobs:
  fingerprint:
    outputs:
      fingerprint: ${{ steps.fingerprint_hash_step.outputs.fingerprint_hash }}
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - name: Install additional tools
        run: sudo apt-get update -y && sudo apt-get install -y jq
      - name: Set fingerprint variables
        id: fingerprint_hash_step
        run: |
          FINGERPRINT=$(npx expo-updates fingerprint:generate --platform ios)
          FINGERPRINT_HASH=$(echo $FINGERPRINT | jq -r '.hash')
          echo "Fingerprint hash: $FINGERPRINT_HASH"
          set-output fingerprint_hash $FINGERPRINT_HASH
      - name: Print fingerprint hash
        run: |
          echo "Fingerprint hash: ${ steps.fingerprint_hash_step.fingerprint_hash }"
  existing_build:
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.fingerprint_hash }}
  decide:
    needs: [existing_build]
    steps:
      - name: decide
        run: |
          BUILD_ID="${{ needs.existing_build.outputs.build_id || '' }}"
          echo $BUILD_ID

          if [ -z "${BUILD_ID}" ] ; then
            echo "No build found. Should build."
            exit 0
          fi

          echo "Found build: https://expo.dev/uuid/$BUILD_ID"
          echo "More about build: ${{ toJSON(needs.existing_build.outputs) }}"
```