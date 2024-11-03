import { useCallback, useState } from 'react'
import styles from '@/styles/collapsibleFooter.module.css'
import commonStyles from "@/styles/common.module.css"
import React from 'react'

interface CollapsibleFooterProps {
  t: (key: string) => string
  showTradeList: boolean
  tradeListLength: number
  onToggleTradeList: () => void
  onCopyFriendCode: () => void
}

export const CollapsibleFooter = ({
  t,
  showTradeList,
  tradeListLength,
  onToggleTradeList,
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
            <div className={styles.instructions}>
              {t('instructions')}
            </div>
          </div>

          <button
              className={commonStyles.button}
              onClick={onCopyFriendCode}
            >
              {t('friendCode')}
            </button>
            <button 
            className={styles.collapseButton}
            onClick={() => setIsExpanded(false)}
          >
            ▼ {t('hideFooter')}
          </button>
            <button
              className={commonStyles.button}
              onClick={onToggleTradeList}
            >
              {showTradeList ? t('showAll') : `${t('showShortlist')} (${tradeListLength})`}
            </button>
        </>
      ) : (
        <div className={styles.collapsedContent}>
          <button
            className={commonStyles.button}
            onClick={onCopyFriendCode}
          >
            {t('friendCode')}
          </button>
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