import styles from '../styles/History.module.scss'

const History = () => {
  return (
    <div>
        <table className={styles.workouts}>
            <thead>
                <tr>
                    <td>Date</td>
                    <td>Workout</td>
                    <td>Notes</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>10 May</td>
                    <td>Push Day</td>
                    <td>Weight moved good</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default History