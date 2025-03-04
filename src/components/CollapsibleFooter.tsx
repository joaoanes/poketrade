import { useState } from 'react'
import styles from '@/styles/collapsibleFooter.module.css'
import commonStyles from "@/styles/common.module.css"
import React from 'react'
import { LanguageTranslator } from '@/providers/LanguageProvider'

const LAST_UPDATED = "23/11/2024"
const PIKACHU_CLASSIFIER = "pika-2"
const SHINY_CLASSIFIER = "simplex-hsv-g-sam"

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
  const [showExtraInfo, setShowExtraInfo] = useState(false)

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

            <div
              className={styles.lastUpdated}
              onClick={() => setShowExtraInfo(prev => !prev)}
            >
              {t('lastUpdatedDate') + " " + LAST_UPDATED }
            </div>
            {showExtraInfo && (
              <div 
                className={styles.extraInfo}
                onClick={() => setShowExtraInfo(prev => !prev)}
              >
                <div>{t('shinyImageClassifier')}: {SHINY_CLASSIFIER}</div>
                <div>{t('pikachuFormsClassifier')}: {PIKACHU_CLASSIFIER}</div>
              </div>
            )}

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