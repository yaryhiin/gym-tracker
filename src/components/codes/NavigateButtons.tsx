import cn from 'classnames'
import styles from '../styles/NavigateButtons.module.scss'

const NavigateButtons = () => {
  return (
    <div className="navigateButtons">
      <button className={cn(styles.home, styles.navButton)}>Home</button>
      <button className={cn(styles.history, styles.navButton)}>History</button>
      <button className={cn(styles.progress, styles.navButton)}>Progress</button>
    </div>
  )
}

export default NavigateButtons