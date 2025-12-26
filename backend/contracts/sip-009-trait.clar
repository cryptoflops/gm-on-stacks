(define-trait nft-trait
  (
    ;; Last token ID, limited to uint range
    (get-last-token-id () (response uint uint))

    ;; URI for the token metadata
    (get-token-uri (uint) (response (optional (string-ascii 256)) uint))

    ;; Owner of the specified token ID
    (get-owner (uint) (response (optional principal) uint))

    ;; Transfer from one principal to another
    (transfer (uint principal principal) (response bool uint))
  )
)
