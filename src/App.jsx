// Main App component

import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import { useFoodLog } from './hooks/useFoodLog'
import { toISODateString } from './utils/formatters'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { log, goal, progress, remaining, isGoalReached, addFood, removeFood, setGoal } = useFoodLog(currentDate)

  // Handle date change
  const handleDateChange = (date) => {
    setCurrentDate(date)
  }

  return (
    <Dashboard
      log={log}
      goal={goal}
      progress={progress}
      remaining={remaining}
      isGoalReached={isGoalReached}
      onAddFood={addFood}
      onRemoveFood={removeFood}
      onSetGoal={setGoal}
      currentDate={currentDate}
      onDateChange={handleDateChange}
    />
  )
}

export default App