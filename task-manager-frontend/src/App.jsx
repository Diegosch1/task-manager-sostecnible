import Sidebar from './components/layout/Sidebar/Sidebar'
import Header from './components/layout/Header/Header'
import TasksPage from './pages/TasksPage'

const App = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <TasksPage />
        </main>
      </div>
    </div>
  )
}

export default App