import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/codes/Home'
import ActiveWorkout from './components/codes/ActiveWorkout'

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
          </Routes>
      </div>
    </Router>
  )
}

export default App
