;; GM on Stacks
;; =========================================================================
;; Dual functionality:
;; - say-gm: Regular transaction (0.1 STX)
;; - mint-gm-nft: Mint a "GM on Stacks" NFT (1 STX)

;; Implement SIP-009 NFT trait
(impl-trait .sip-009-trait.nft-trait)

;; =========================================================================
;; CONSTANTS
;; =========================================================================

(define-constant CONTRACT_OWNER tx-sender)
(define-constant GM_FEE u100000)       ;; 0.1 STX for regular GM
(define-constant NFT_FEE u1000000)     ;; 1 STX for NFT mint

(define-constant ERR_NOT_TOKEN_OWNER (err u100))
(define-constant ERR_NOT_AUTHORIZED (err u101))
(define-constant ERR_INSUFFICIENT_FUNDS (err u102))

;; =========================================================================
;; DATA VARS & MAPS
;; =========================================================================

;; NFT definition
(define-non-fungible-token gm-nft uint)

;; Counters
(define-data-var last-token-id uint u0)
(define-data-var total-gms uint u0)

;; GM message storage
(define-map UserGM principal (string-ascii 64))

;; NFT metadata
(define-data-var base-uri (string-ascii 256) "ipfs://bafybeid7zjg55ukcb3qvi2dd4psbs7fz4ivds7xgrmsp55nzuwslftxnp4")

;; =========================================================================
;; SIP-009 STANDARD FUNCTIONS
;; =========================================================================

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
  (ok (some (var-get base-uri)))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? gm-nft token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR_NOT_TOKEN_OWNER)
    (nft-transfer? gm-nft token-id sender recipient)
  )
)

;; =========================================================================
;; READ-ONLY FUNCTIONS
;; =========================================================================

(define-read-only (get-total-gms)
  (ok (var-get total-gms))
)

(define-read-only (get-user-gm (user principal))
  (ok (map-get? UserGM user))
)

;; =========================================================================
;; PUBLIC FUNCTIONS - REGULAR GM (0.1 STX)
;; =========================================================================

(define-public (say-gm)
  (let (
    (sender tx-sender)
    (current-count (var-get total-gms))
  )
    ;; Pay 0.1 STX
    (try! (stx-transfer? GM_FEE sender CONTRACT_OWNER))

    ;; Store GM
    (map-set UserGM sender "gm")
    (var-set total-gms (+ current-count u1))

    ;; Emit event
    (print {
      event: "gm",
      type: "message",
      sender: sender,
      count: (+ current-count u1),
      timestamp: block-height
    })

    (ok (+ current-count u1))
  )
)

(define-public (say-gm-message (message (string-ascii 64)))
  (let (
    (sender tx-sender)
    (current-count (var-get total-gms))
  )
    (try! (stx-transfer? GM_FEE sender CONTRACT_OWNER))
    (map-set UserGM sender message)
    (var-set total-gms (+ current-count u1))

    (print {
      event: "gm",
      type: "message",
      sender: sender,
      message: message,
      count: (+ current-count u1),
      timestamp: block-height
    })

    (ok (+ current-count u1))
  )
)

;; =========================================================================
;; PUBLIC FUNCTIONS - NFT MINT (1 STX)
;; =========================================================================

(define-public (mint-gm-nft)
  (let (
    (next-id (+ (var-get last-token-id) u1))
    (buyer tx-sender)
  )
    ;; Pay 1 STX
    (try! (stx-transfer? NFT_FEE buyer CONTRACT_OWNER))

    ;; Mint NFT
    (try! (nft-mint? gm-nft next-id buyer))

    ;; Update state
    (var-set last-token-id next-id)
    (var-set total-gms (+ (var-get total-gms) u1))

    ;; Emit event
    (print {
      event: "gm",
      type: "nft-mint",
      sender: buyer,
      token-id: next-id,
      price: NFT_FEE,
      timestamp: block-height
    })

    (ok next-id)
  )
)

;; =========================================================================
;; ADMIN FUNCTIONS
;; =========================================================================

(define-public (set-base-uri (new-uri (string-ascii 256)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (var-set base-uri new-uri)
    (ok true)
  )
)
