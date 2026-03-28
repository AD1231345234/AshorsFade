import { useEffect, useState } from 'react';
import './DailySpreadsheet.css';

interface Row {
  time: string;
  client_name: string;
  service: string;
  barber: string;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export function DailySpreadsheet() {
  const [rows, setRows] = useState<Row[]>([]);
  const [newRow, setNewRow] = useState({
    time: '',
    client_name: '',
    service: '',
    barber: '',
    notes: '',
  });

  useEffect(() => {
    loadSpreadsheet();
  }, []);

  const loadSpreadsheet = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/spreadsheet/today');
      if (response.ok) {
        const data = await response.json();
        setRows(data.rows || []);
      }
    } catch (error) {
      console.error('Failed to load spreadsheet:', error);
      // Demo data if server not available
      setRows([]);
    }
  };

  const handleAddRow = async () => {
    if (!newRow.time || !newRow.client_name || !newRow.service || !newRow.barber) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/spreadsheet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRow, status: 'pending' }),
      });

      if (response.ok) {
        const added = await response.json();
        setRows([...rows, added]);
        setNewRow({ time: '', client_name: '', service: '', barber: '', notes: '' });
      }
    } catch (error) {
      console.error('Failed to add row:', error);
      // Add locally if server not available
      setRows([...rows, { ...newRow, status: 'pending' }]);
      setNewRow({ time: '', client_name: '', service: '', barber: '', notes: '' });
    }
  };

  const handleStatusChange = async (index: number, status: string) => {
    try {
      await fetch(`http://localhost:3001/api/spreadsheet/row/${index}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }

    const updated = [...rows];
    updated[index].status = status as any;
    setRows(updated);
  };

  return (
    <div className="spreadsheet-container">
      <div className="spreadsheet-header">
        <h1>Ashor's Fade - Daily Schedule</h1>
        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="add-row-form">
        <h3>Add New Appointment</h3>
        <div className="form-grid">
          <input
            type="time"
            placeholder="Time"
            value={newRow.time}
            onChange={(e) => setNewRow({ ...newRow, time: e.target.value })}
          />
          <input
            type="text"
            placeholder="Client Name"
            value={newRow.client_name}
            onChange={(e) => setNewRow({ ...newRow, client_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Service"
            value={newRow.service}
            onChange={(e) => setNewRow({ ...newRow, service: e.target.value })}
          />
          <input
            type="text"
            placeholder="Barber"
            value={newRow.barber}
            onChange={(e) => setNewRow({ ...newRow, barber: e.target.value })}
          />
          <input
            type="text"
            placeholder="Notes (optional)"
            value={newRow.notes}
            onChange={(e) => setNewRow({ ...newRow, notes: e.target.value })}
          />
          <button onClick={handleAddRow}>Add Appointment</button>
        </div>
      </div>

      <div className="spreadsheet-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Client Name</th>
              <th>Service</th>
              <th>Barber</th>
              <th>Notes</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No appointments scheduled yet</td></tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className={`status-${row.status}`}>
                  <td>{row.time}</td>
                  <td>{row.client_name}</td>
                  <td>{row.service}</td>
                  <td>{row.barber}</td>
                  <td>{row.notes || '-'}</td>
                  <td>
                    <select
                      value={row.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
