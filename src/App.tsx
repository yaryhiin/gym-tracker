import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/codes/Home'
import ActiveWorkout from './components/codes/ActiveWorkout'
import History from './components/codes/History'
import Progress from './components/codes/Progress'

function App() {
  const userName = 'Tim'

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={
            <Home userName={userName}/>
          } />
          <Route path='/workout' element={
            <ActiveWorkout />
          } />
          <Route path='/history' element={
            <History />
          } />
          <Route path='/progress' element={
            <Progress />
          } />
          </Routes>
      </div>
    </Router>
  )
}

export default App
