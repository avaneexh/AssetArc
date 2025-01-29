// App.jsx
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function App() {
  const [investments, setInvestments] = useState([])
  const [formData, setFormData] = useState({
    symbol: '',
    date: '',
    quantity: ''
  })

  // Mock API call to fetch stock price
  const fetchStockPrice = async (symbol) => {
    // In real app, replace with actual API call
    return Math.random() * 1000 + 1000 // Random price between 1000-2000
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const price = await fetchStockPrice(formData.symbol)
    
    const newInvestment = {
      ...formData,
      price,
      currentPrice: price,
      id: Date.now()
    }
    
    setInvestments([...investments, newInvestment])
    setFormData({ symbol: '', date: '', quantity: '' })
  }

  // Chart data calculations
  const lineChartData = {
    labels: investments.map(inv => inv.date),
    datasets: [{
      label: 'Portfolio Value',
      data: investments.map(inv => inv.quantity * inv.currentPrice),
      borderColor: '#4f46e5',
      tension: 0.1
    }]
  }

  const pieChartData = {
    labels: ['Large Cap', 'Mid Cap', 'Small Cap'],
    datasets: [{
      data: [
        investments.filter(inv => inv.currentPrice > 1000).length,
        investments.filter(inv => inv.currentPrice > 500 && inv.currentPrice <= 1000).length,
        investments.filter(inv => inv.currentPrice <= 500).length
      ],
      backgroundColor: ['#4f46e5', '#6366f1', '#818cf8']
    }]
  }

  return (
    <div className="min-h-screen bg-base-200 p-8">
      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="text-xl font-bold mb-4">Portfolio Growth</h2>
          <Line data={lineChartData} />
        </div>
        
        <div className="card bg-base-100 shadow-xl p-4">
          <h2 className="text-xl font-bold mb-4">Market Cap Allocation</h2>
          <Pie data={pieChartData} />
        </div>
      </div>

      {/* Add Investment Form */}
      <div className="card bg-base-100 shadow-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Investment</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Stock Symbol (e.g., RELIANCE)"
            className="input input-bordered"
            value={formData.symbol}
            onChange={(e) => setFormData({...formData, symbol: e.target.value})}
            required
          />
          <input
            type="date"
            className="input input-bordered"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            className="input input-bordered"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            required
          />
          <button type="submit" className="btn btn-primary md:col-span-3">
            Add Investment
          </button>
        </form>
      </div>

      {/* Investments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {investments.map((investment) => {
          const profitLoss = (investment.currentPrice - investment.price) * investment.quantity
          const profitLossPercent = ((investment.currentPrice / investment.price - 1) * 100).toFixed(2)

          return (
            <div key={investment.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{investment.symbol}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>Quantity: {investment.quantity}</p>
                    <p>Buy Price: ₹{investment.price.toFixed(2)}</p>
                    <p>Current Price: ₹{investment.currentPrice.toFixed(2)}</p>
                  </div>
                  <div className={`text-${profitLoss >= 0 ? 'success' : 'error'}`}>
                    <p>P/L: ₹{profitLoss.toFixed(2)}</p>
                    <p>({profitLossPercent}%)</p>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-sm btn-success">Buy More</button>
                  <button className="btn btn-sm btn-error">Sell</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}