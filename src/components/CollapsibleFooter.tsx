import { useState } from 'react'
import styles from '@/styles/collapsibleFooter.module.css'
import commonStyles from "@/styles/common.module.css"
import React from 'react'
import { LanguageTranslator } from '@/providers/LanguageProvider'

interface CollapsibleFooterProps {
  t: LanguageTranslator
  showTradeList: boolean
  tradeListLength: number
  onToggleTradeList: () => void
  onCopyFriendCode: () => void
}

export const CollapsibleFooter = ({
  t,
  showTradeList,
  onCopyFriendCode
}: CollapsibleFooterProps) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className={`${styles.footer} ${!isExpanded ? styles.collapsed : ''}`}>
      {isExpanded ? (
        <>
          <div className={styles.footerContent}>

            <div>
              {showTradeList ? (
                <div className={styles.messageText}>
                  <div>{t('shortlistIntro')}</div>
                  <div className={styles.smallText}>{t('shortlistIntro2')}</div>
                </div>
              ) : (
                <div className={styles.messageText}>
                  <div>{t('welcome')}</div>
                  <div>{t('welcome2')}</div>
                </div>
              )}
            </div>

            <button
              className={commonStyles.button}
              onClick={onCopyFriendCode}
            >
              {t('friendCode')}
            </button>
          </div>

          <button
            className={styles.collapseButton}
            onClick={() => setIsExpanded(false)}
          >
            ▼ {t('hideFooter')}
          </button>

        </>
      ) : (
        <div className={styles.collapsedContent}>
          <div className={styles.collapsedButton}>
            <button
              className={commonStyles.button}
              onClick={onCopyFriendCode}
            >
              {t('friendCode')}
            </button>
          </div>
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded(true)}
          >
            ▲
          </button>
        </div>
      )}
    </div>
  )
} 