// History component for viewing past protein intake

import { useState, useEffect } from 'react'
import { getLogsInRange, getAllLogs } from '../services/storage'
import { formatDate, formatProtein, toISODateString } from '../utils/formatters'

/**
 * History component
 * @param {Object} props
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSelectDate - Select date callback
 */
export default function History({ onClose, onSelectDate }) {
  const [logs, setLogs] = useState([])
  const [view, setView] = useState('list') // 'list' or 'chart'

  useEffect(() => {
    // Get last 30 days of logs
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    
    const allLogs = getAllLogs()
    const logArray = Object.values(allLogs)
      .filter(log => {
        const logDate = new Date(log.date)
        return logDate >= startDate && logDate <= endDate
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    setLogs(logArray)
  }, [])

  // Calculate stats
  const avgProtein = logs.length > 0 
    ? Math.round(logs.reduce((sum, log) => sum + log.totalProtein, 0) / logs.length)
    : 0
  
  const maxProtein = logs.length > 0 
    ? Math.max(...logs.map(log => log.totalProtein))
    : 0

  const goalReachedDays = logs.filter(log => log.totalProtein >= log.goal).length

  // Get day of week
  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  // Get bar height percentage
  const getBarHeight = (protein, goal) => {
    return Math.min((protein / goal) * 100, 100)
  }

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-3 border-b">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">History</h1>
      </div>

      {/* Stats summary */}
      <div className="bg-white p-4 mb-2">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-protein">{avgProtein}g</div>
            <div className="text-xs text-gray-500">Avg daily</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{maxProtein}g</div>
            <div className="text-xs text-gray-500">Best day</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{goalReachedDays}</div>
            <div className="text-xs text-gray-500">Goals hit</div>
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="bg-white px-4 py-2 flex gap-2 mb-2">
        <button
          onClick={() => setView('list')}
          className={`flex-1 py-2 rounded-lg font-medium ${
            view === 'list' ? 'bg-protein text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          List
        </button>
        <button
          onClick={() => setView('chart')}
          className={`flex-1 py-2 rounded-lg font-medium ${
            view === 'chart' ? 'bg-protein text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Chart
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No history yet</p>
            <p className="text-sm mt-1">Start logging to see your progress</p>
          </div>
        ) : view === 'list' ? (
          // List view
          <div className="space-y-2">
            {logs.map((log) => (
              <button
                key={log.date}
                onClick={() => onSelectDate(new Date(log.date))}
                className="w-full card flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {formatDate(log.date)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getDayOfWeek(log.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    log.totalProtein >= log.goal ? 'text-protein' : 'text-gray-900'
                  }`}>
                    {formatProtein(log.totalProtein)}
                  </div>
                  <div className="text-xs text-gray-400">
                    goal: {formatProtein(log.goal)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Chart view
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Last 7 Days</h3>
            <div className="flex items-end justify-between h-40 gap-2">
              {logs.slice(0, 7).reverse().map((log) => (
                <div key={log.date} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-100 rounded-t-lg relative h-32">
                    <div
                      className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                        log.totalProtein >= log.goal 
                          ? 'bg-protein' 
                          : 'bg-protein-light'
                      }`}
                      style={{ height: `${getBarHeight(log.totalProtein, log.goal)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {getDayOfWeek(log.date)}
                  </div>
                  <div className="text-xs font-medium text-gray-900">
                    {formatProtein(log.totalProtein)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}