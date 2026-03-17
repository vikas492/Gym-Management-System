import { useState, useEffect } from 'react'
import {
  getEquipmentApi, createEquipmentApi,
  updateEquipmentApi, deleteEquipmentApi,
  addMaintenanceLogApi, updateLogStatusApi
} from '../api/equipment'

const zones = ['All', 'Cardio', 'Weights', 'Studio']

const statusStyles = {
  GOOD:         'bg-green-50 text-green-700',
  SERVICE_DUE:  'bg-amber-50 text-amber-700',
  UNDER_REPAIR: 'bg-red-50 text-red-700',
}

const logStatusStyles = {
  OPEN:      'bg-red-50 text-red-700',
  SCHEDULED: 'bg-amber-50 text-amber-700',
  FIXED:     'bg-green-50 text-green-700',
  DONE:      'bg-gray-100 text-gray-500',
}

const conditionColor = (pct) => {
  if (pct >= 80) return 'bg-green-400'
  if (pct >= 50) return 'bg-amber-400'
  return 'bg-red-400'
}

const getAutoStatus = (condition) => {
  if (condition >= 80) return 'GOOD'
  if (condition >= 50) return 'SERVICE_DUE'
  return 'UNDER_REPAIR'
}

export default function Equipment() {
  const [equipment,  setEquipment] = useState([])
  const [loading,    setLoading]   = useState(true)
  const [activeZone, setZone]      = useState('All')
  const [showForm,   setShowForm]  = useState(false)
  const [showLog,    setShowLog]   = useState(null)
  const [saving,     setSaving]    = useState(false)
  const [form, setForm] = useState({
    name: '', zone: 'Cardio', quantity: 1, condition: 100, status: 'GOOD'
  })
  const [logForm, setLogForm] = useState({ issue: '' })

  useEffect(() => { fetchEquipment() }, [activeZone])

  const fetchEquipment = async () => {
    setLoading(true)
    try {
      const params = activeZone !== 'All' ? { zone: activeZone } : {}
      const res    = await getEquipmentApi(params)
      setEquipment(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const condition = Number(form.condition)
      await createEquipmentApi({ ...form, condition, status: getAutoStatus(condition) })
      setShowForm(false)
      setForm({ name: '', zone: 'Cardio', quantity: 1, condition: 100, status: 'GOOD' })
      fetchEquipment()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handleAddLog = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await addMaintenanceLogApi(showLog, logForm)
      setShowLog(null)
      setLogForm({ issue: '' })
      fetchEquipment()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handleDeleteEquipment = async (id) => {
    if (!confirm('Delete this equipment?')) return
    try { await deleteEquipmentApi(id); fetchEquipment() }
    catch (err) { console.error(err) }
  }

  const handleUpdateLogStatus = async (equipmentId, logId, status) => {
    try { await updateLogStatusApi(equipmentId, logId, { status }); fetchEquipment() }
    catch (err) { console.error(err) }
  }

  const handleUpdateCondition = async (id, newCondition) => {
    const condition = Number(newCondition)
    const status    = getAutoStatus(condition)
    try { await updateEquipmentApi(id, { condition, status }); fetchEquipment() }
    catch (err) { console.error(err) }
  }

  const allLogs = equipment
    .flatMap(e => (e.logs || []).map(l => ({ ...l, equipmentName: e.name })))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)

  const zoneConditions = ['Cardio', 'Weights', 'Studio'].map((zone) => {
    const items = equipment.filter(e => e.zone === zone)
    const avg   = items.length ? Math.round(items.reduce((s, e) => s + e.condition, 0) / items.length) : 0
    return { zone, avg }
  })

  const stats = [
    { label: 'Total assets',  value: equipment.length,                                          sub: 'Across all zones', subColor: 'text-gray-400'  },
    { label: 'Operational',   value: equipment.filter(e => e.status === 'GOOD').length,         sub: 'Good condition',   subColor: 'text-green-600' },
    { label: 'Under repair',  value: equipment.filter(e => e.status === 'UNDER_REPAIR').length, sub: 'Being fixed',      subColor: 'text-amber-500' },
    { label: 'Service due',   value: equipment.filter(e => e.status === 'SERVICE_DUE').length,  sub: 'Needs attention',  subColor: 'text-red-500'   },
  ]

  return (
    <div className="space-y-4 md:space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 md:p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-xl md:text-2xl font-medium text-gray-900">{s.value}</p>
            <p className={`text-xs mt-1 ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table + sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Equipment table */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-800 flex-shrink-0">Assets</p>
              <div className="flex gap-1.5 overflow-x-auto">
                {zones.map((z) => (
                  <button key={z} onClick={() => setZone(z)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors flex-shrink-0 ${
                      activeZone === z
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0 ml-2"
            >
              + Add
            </button>
          </div>

          {loading ? (
            <div className="text-center text-sm text-gray-400 py-10">Loading...</div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Equipment</th>
                      <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Zone</th>
                      <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Qty</th>
                      <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Condition</th>
                      <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map((e) => (
                      <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                        <td className="px-4 py-3 text-xs font-medium text-gray-800">{e.name}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{e.zone}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{e.quantity}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${conditionColor(e.condition)}`} style={{ width: `${e.condition}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 w-7">{e.condition}%</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateCondition(e.id, Math.max(0, e.condition - 5))}
                                className="w-5 h-5 rounded border border-gray-200 text-gray-400 hover:bg-gray-100 flex items-center justify-center text-xs leading-none"
                              >−</button>
                              <button
                                onClick={() => handleUpdateCondition(e.id, Math.min(100, e.condition + 5))}
                                className="w-5 h-5 rounded border border-gray-200 text-gray-400 hover:bg-gray-100 flex items-center justify-center text-xs leading-none"
                              >+</button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[e.status]}`}>
                            {e.status === 'SERVICE_DUE' ? 'Service due' : e.status === 'UNDER_REPAIR' ? 'Under repair' : 'Good'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setShowLog(e.id)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ Log</button>
                            <button onClick={() => handleDeleteEquipment(e.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {equipment.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-sm text-gray-400 py-10">No equipment found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-50">
                {equipment.map((e) => (
                  <div key={e.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{e.name}</p>
                        <p className="text-xs text-gray-400">{e.zone} · Qty: {e.quantity}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[e.status]}`}>
                        {e.status === 'SERVICE_DUE' ? 'Service due' : e.status === 'UNDER_REPAIR' ? 'Under repair' : 'Good'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${conditionColor(e.condition)}`} style={{ width: `${e.condition}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{e.condition}%</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateCondition(e.id, Math.max(0, e.condition - 5))}
                          className="w-6 h-6 rounded border border-gray-200 text-gray-400 flex items-center justify-center text-sm"
                        >−</button>
                        <button
                          onClick={() => handleUpdateCondition(e.id, Math.min(100, e.condition + 5))}
                          className="w-6 h-6 rounded border border-gray-200 text-gray-400 flex items-center justify-center text-sm"
                        >+</button>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowLog(e.id)} className="text-xs text-indigo-600 font-medium">+ Log issue</button>
                      <button onClick={() => handleDeleteEquipment(e.id)} className="text-xs text-red-400 font-medium">Delete</button>
                    </div>
                  </div>
                ))}
                {equipment.length === 0 && (
                  <div className="text-center text-sm text-gray-400 py-10">No equipment found</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">

          {/* Zone condition */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-medium text-gray-800 mb-4">Zone condition</p>
            <div className="space-y-3">
              {zoneConditions.map(({ zone, avg }) => (
                <div key={zone}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">{zone}</span>
                    <span className="text-xs font-medium text-gray-700">{avg}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${conditionColor(avg)}`} style={{ width: `${avg}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance log */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-medium text-gray-800 mb-4">Maintenance log</p>
            <div className="space-y-3">
              {allLogs.length === 0 && <p className="text-xs text-gray-400">No logs yet</p>}
              {allLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-medium text-gray-800 truncate">{log.equipmentName}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${logStatusStyles[log.status]}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{log.issue}</p>
                    {log.status === 'OPEN' && (
                      <button onClick={() => handleUpdateLogStatus(log.equipmentId, log.id, 'SCHEDULED')} className="text-xs text-indigo-500 hover:text-indigo-700">
                        Mark scheduled
                      </button>
                    )}
                    {log.status === 'SCHEDULED' && (
                      <button onClick={() => handleUpdateLogStatus(log.equipmentId, log.id, 'FIXED')} className="text-xs text-green-500 hover:text-green-700">
                        Mark fixed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add equipment form */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4">
            <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-sm shadow-xl flex flex-col" style={{ maxHeight: '85vh' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <span className="text-sm font-medium text-gray-800">Add equipment</span>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
              </div>
              <div className="overflow-y-auto flex-1 px-5 py-4">
                <form id="equipment-form" onSubmit={handleCreate} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Name</label>
                    <input type="text" value={form.name} required
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Treadmill"
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Zone</label>
                      <select value={form.zone}
                        onChange={(e) => setForm({ ...form, zone: e.target.value })}
                        className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                      >
                        <option>Cardio</option>
                        <option>Weights</option>
                        <option>Studio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Quantity</label>
                      <input type="number" value={form.quantity} required min="1"
                        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                        className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Condition (%) — status auto-updates</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="100" step="5" value={form.condition}
                        onChange={(e) => setForm({ ...form, condition: Number(e.target.value), status: getAutoStatus(Number(e.target.value)) })}
                        className="flex-1"
                      />
                      <span className="text-xs font-medium text-gray-700 w-8">{form.condition}%</span>
                    </div>
                    <div className="mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[form.status]}`}>
                        {form.status === 'SERVICE_DUE' ? 'Service due' : form.status === 'UNDER_REPAIR' ? 'Under repair' : 'Good'}
                      </span>
                    </div>
                  </div>
                </form>
              </div>
              <div className="flex gap-2 px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
                <button type="submit" form="equipment-form" disabled={saving}
                  className="flex-1 text-xs bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {saving ? 'Saving...' : 'Add equipment'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 text-xs border border-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Log issue form */}
      {showLog && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowLog(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4">
            <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-sm shadow-xl flex flex-col" style={{ maxHeight: '85vh' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <span className="text-sm font-medium text-gray-800">Log maintenance issue</span>
                <button onClick={() => setShowLog(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
              </div>
              <div className="overflow-y-auto flex-1 px-5 py-4">
                <form id="log-form" onSubmit={handleAddLog} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Describe the issue</label>
                    <textarea value={logForm.issue} required rows={4}
                      onChange={(e) => setLogForm({ issue: e.target.value })}
                      placeholder="Belt worn out, bolt loose..."
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 resize-none"
                    />
                  </div>
                </form>
              </div>
              <div className="flex gap-2 px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
                <button type="submit" form="log-form" disabled={saving}
                  className="flex-1 text-xs bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {saving ? 'Saving...' : 'Submit log'}
                </button>
                <button type="button" onClick={() => setShowLog(null)}
                  className="flex-1 text-xs border border-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}