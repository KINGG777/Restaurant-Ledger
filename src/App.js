import React, { useState, useEffect } from 'react';
import { Plus, Settings, X, Trash2, Eye, EyeOff, LogOut, ArrowLeft, DollarSign, CreditCard, Wallet, UserX, Calendar, ChevronDown } from 'lucide-react';

// Toast Component
function Toast({ message, onClose, type = 'error' }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: type === 'error' ? '#ef4444' : '#10b981',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease-out'
    }}>
      {message}
    </div>
  );
}

// Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          zIndex: 1
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

// Storage functions
function initStorage() {
  const stored = localStorage.getItem('restaurantLedger');
  if (!stored) {
    const data = {
      credentials: { id: 'KINGG', password: 'KINGG123' },
      customers: {}
    };
    localStorage.setItem('restaurantLedger', JSON.stringify(data));
    return data;
  }
  return JSON.parse(stored);
}

function getData() {
  const data = localStorage.getItem('restaurantLedger');
  return data ? JSON.parse(data) : initStorage();
}

function saveData(data) {
  localStorage.setItem('restaurantLedger', JSON.stringify(data));
}

function generatePIN(customers) {
  const existingPINs = Object.values(customers).map(c => c.pin);
  let pin;
  do {
    pin = Math.floor(1000 + Math.random() * 9000).toString();
  } while (existingPINs.includes(pin));
  return pin;
}

// Utility function to get month/year options
function getMonthYearOptions(customers) {
  const monthYears = new Set();
  
  Object.values(customers).forEach(customer => {
    customer.transactions?.forEach(t => {
      if (t.date) {
        const date = new Date(t.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthYears.add(monthYear);
      }
    });
  });
  
  return Array.from(monthYears).sort().reverse();
}

// Filter transactions by month
function filterTransactionsByMonth(transactions, selectedMonth) {
  if (!selectedMonth || selectedMonth === 'all') return transactions;
  
  return transactions.filter(t => {
    if (!t.date) return false;
    const date = new Date(t.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return monthYear === selectedMonth;
  });
}

// Format month for display
function formatMonthDisplay(monthYear) {
  if (!monthYear) return '';
  const [year, month] = monthYear.split('-');
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

// Login Page
function LoginPage({ onLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const data = getData();
    if (id === data.credentials.id && password === data.credentials.password) {
      onLogin();
    } else {
      setError('Invalid ID or Password');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #9333ea, #ec4899, #ef4444)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      {error && <Toast message={error} onClose={() => setError('')} />}
      
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        padding: '48px',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            marginBottom: '16px'
          }}>
            <Wallet size={40} color="white" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
            KINGG Restaurant
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            Ledger Management System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Universal ID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter Universal ID"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Universal Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'white',
              color: '#9333ea',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// Home Page
function HomePage({ onLogout, onViewCustomer, onSettings }) {
  const [customers, setCustomers] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customPIN, setCustomPIN] = useState('');
  const [useCustomPIN, setUseCustomPIN] = useState(false);
  const [showPINVerify, setShowPINVerify] = useState(false);
  const [selectedCustomerForPIN, setSelectedCustomerForPIN] = useState(null);
  const [enteredPIN, setEnteredPIN] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  useEffect(() => {
    loadCustomers();
  }, []);

  function loadCustomers() {
    const data = getData();
    setCustomers(data.customers);
  }

  function handleViewCustomerClick(customerName) {
    setSelectedCustomerForPIN(customerName);
    setShowPINVerify(true);
    setEnteredPIN('');
  }

  function handlePINVerify() {
    const customer = customers[selectedCustomerForPIN];
    if (enteredPIN === customer.pin) {
      setShowPINVerify(false);
      setEnteredPIN('');
      onViewCustomer(selectedCustomerForPIN);
    } else {
      setError('Invalid PIN');
      setEnteredPIN('');
    }
  }

  function getCustomerBalance(customer, filterMonth = null) {
    let credit = 0;
    let paid = 0;
    const transactions = filterMonth && filterMonth !== 'all' 
      ? filterTransactionsByMonth(customer.transactions || [], filterMonth)
      : customer.transactions || [];
    
    transactions.forEach(t => {
      if (t.type === 'credit') credit += t.amount;
      else if (t.type === 'payment') paid += t.amount;
    });
    return credit - paid;
  }

  function calculateTotals(filterMonth = null) {
    let totalCredit = 0;
    let totalPaid = 0;
    Object.values(customers).forEach(customer => {
      const transactions = filterMonth && filterMonth !== 'all'
        ? filterTransactionsByMonth(customer.transactions || [], filterMonth)
        : customer.transactions || [];
      
      transactions.forEach(t => {
        if (t.type === 'credit') totalCredit += t.amount;
        else if (t.type === 'payment') totalPaid += t.amount;
      });
    });
    return { totalCredit, totalPaid };
  }

  function handleAddCustomer() {
    const data = getData();
    
    if (verifyPassword !== data.credentials.password) {
      setError('Invalid Password');
      return;
    }

    if (!newCustomerName.trim()) {
      setError('Customer name is required');
      return;
    }

    if (customers[newCustomerName]) {
      setError('Customer already exists');
      return;
    }

    let pin;
    if (useCustomPIN && customPIN) {
      if (customPIN.length !== 4 || isNaN(customPIN)) {
        setError('PIN must be exactly 4 digits');
        return;
      }
      const existingPINs = Object.values(data.customers).map(c => c.pin);
      if (existingPINs.includes(customPIN)) {
        setError('This PIN is already in use');
        return;
      }
      pin = customPIN;
    } else {
      pin = generatePIN(data.customers);
    }

    data.customers[newCustomerName] = { pin, transactions: [] };
    saveData(data);
    loadCustomers();
    setShowAddModal(false);
    setNewCustomerName('');
    setVerifyPassword('');
    setCustomPIN('');
    setUseCustomPIN(false);
    setSuccess('Customer added successfully!');
  }

  function handleDeleteCustomer() {
    const data = getData();
    
    if (deletePassword !== data.credentials.password) {
      setError('Invalid Password');
      return;
    }

    delete data.customers[customerToDelete];
    saveData(data);
    loadCustomers();
    setShowDeleteModal(false);
    setCustomerToDelete('');
    setDeletePassword('');
    setSuccess('Customer deleted successfully!');
  }

  const monthYearOptions = getMonthYearOptions(customers);
  const { totalCredit, totalPaid } = calculateTotals(selectedMonth);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)' }}>
      {error && <Toast message={error} onClose={() => setError('')} type="error" />}
      {success && <Toast message={success} onClose={() => setSuccess('')} type="success" />}

      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(to bottom right, #a855f7, #ec4899)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={24} color="white" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Restaurant Ledger - KINGG
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onSettings}
              style={{
                padding: '8px',
                background: 'none',
                border: 'none',
                color: '#4b5563',
                cursor: 'pointer',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Settings size={24} />
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: '8px',
                background: 'none',
                border: 'none',
                color: '#4b5563',
                cursor: 'pointer',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Month Filter */}
        <div style={{ 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#374151',
            fontWeight: '600'
          }}>
            <Calendar size={20} />
            <span>Filter by Month:</span>
          </div>
          <div style={{ position: 'relative', flex: '1', maxWidth: '300px' }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 36px 10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#1f2937',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <option value="all">All Time</option>
              {monthYearOptions.map(monthYear => (
                <option key={monthYear} value={monthYear}>
                  {formatMonthDisplay(monthYear)}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6b7280'
              }}
            />
          </div>
          {selectedMonth !== 'all' && (
            <button
              onClick={() => setSelectedMonth('all')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(to bottom right, #10b981, #059669)',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            padding: '24px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, opacity: 0.9 }}>
                Total Credit {selectedMonth !== 'all' && <span style={{ fontSize: '14px' }}>({formatMonthDisplay(selectedMonth)})</span>}
              </h3>
              <CreditCard size={28} />
            </div>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>₹{totalCredit.toLocaleString()}</p>
          </div>

          <div style={{
            background: 'linear-gradient(to bottom right, #3b82f6, #6366f1)',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            padding: '24px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, opacity: 0.9 }}>
                Total Paid {selectedMonth !== 'all' && <span style={{ fontSize: '14px' }}>({formatMonthDisplay(selectedMonth)})</span>}
              </h3>
              <DollarSign size={28} />
            </div>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>₹{totalPaid.toLocaleString()}</p>
          </div>
        </div>

        {/* Customers Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', background: 'linear-gradient(to right, #a855f7, #ec4899)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Customers {selectedMonth !== 'all' && `(${formatMonthDisplay(selectedMonth)})`}
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'white',
                color: '#a855f7',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} />
              Add Customer
            </button>
          </div>

          {Object.keys(customers).length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
              <Wallet size={64} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
              <p style={{ fontSize: '18px', margin: 0 }}>No customers yet. Add your first customer!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <tr>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>
                      Customer Name
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>
                      Balance
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(customers).map(([name, customer]) => {
                    const balance = getCustomerBalance(customer, selectedMonth);
                    
                    // Skip customers with no transactions in selected month
                    if (selectedMonth !== 'all') {
                      const monthTransactions = filterTransactionsByMonth(customer.transactions || [], selectedMonth);
                      if (monthTransactions.length === 0) return null;
                    }
                    
                    return (
                      <tr key={name} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: '600', color: '#111827' }}>{name}</div>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <span style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: balance > 0 ? '#dc2626' : balance < 0 ? '#059669' : '#4b5563'
                          }}>
                            ₹{Math.abs(balance).toLocaleString()}
                          </span>
                          {balance > 0 && <span style={{ fontSize: '12px', color: '#dc2626', marginLeft: '4px' }}>(Due)</span>}
                          {balance < 0 && <span style={{ fontSize: '12px', color: '#059669', marginLeft: '4px' }}>(Advance)</span>}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleViewCustomerClick(name)}
                              style={{
                                padding: '10px 20px',
                                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            >
                              View Ledger
                            </button>
                            <button
                              onClick={() => {
                                setCustomerToDelete(name);
                                setShowDeleteModal(true);
                              }}
                              style={{
                                padding: '10px',
                                background: 'linear-gradient(to right, #ef4444, #dc2626)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                              title="Delete Customer"
                            >
                              <UserX size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals remain the same as before */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewCustomerName('');
          setVerifyPassword('');
          setCustomPIN('');
          setUseCustomPIN(false);
        }}
        title="Add New Customer"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Customer Name
            </label>
            <input
              type="text"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              placeholder="Enter customer name"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Universal Password (Verification)
            </label>
            <input
              type="password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ 
            padding: '12px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              <input
                type="checkbox"
                checked={useCustomPIN}
                onChange={(e) => setUseCustomPIN(e.target.checked)}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
              />
              Set Custom PIN (or auto-generate)
            </label>
          </div>

          {useCustomPIN && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Customer PIN (4 digits)
              </label>
              <input
                type="text"
                value={customPIN}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setCustomPIN(value);
                }}
                placeholder="Enter 4-digit PIN"
                maxLength="4"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Leave empty to auto-generate
              </p>
            </div>
          )}

          <button
            onClick={handleAddCustomer}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(to right, #a855f7, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            Add Customer
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showPINVerify}
        onClose={() => {
          setShowPINVerify(false);
          setEnteredPIN('');
          setSelectedCustomerForPIN(null);
        }}
        title="Enter Customer PIN"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
              Customer
            </p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              {selectedCustomerForPIN}
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Enter 4-Digit PIN
            </label>
            <input
              type="password"
              value={enteredPIN}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setEnteredPIN(value);
              }}
              placeholder="****"
              maxLength="4"
              autoFocus
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '24px',
                fontFamily: 'monospace',
                textAlign: 'center',
                letterSpacing: '8px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && enteredPIN.length === 4) {
                  handlePINVerify();
                }
              }}
            />
          </div>

          <button
            onClick={handlePINVerify}
            disabled={enteredPIN.length !== 4}
            style={{
              width: '100%',
              padding: '14px',
              background: enteredPIN.length === 4 
                ? 'linear-gradient(to right, #a855f7, #ec4899)'
                : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: enteredPIN.length === 4 ? 'pointer' : 'not-allowed',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              opacity: enteredPIN.length === 4 ? 1 : 0.6
            }}
          >
            Verify & Open
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCustomerToDelete('');
          setDeletePassword('');
        }}
        title="Delete Customer"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            border: '1px solid #fecaca'
          }}>
            <p style={{ color: '#991b1b', margin: 0, fontWeight: '600' }}>
              ⚠️ Warning: This will permanently delete customer "{customerToDelete}" and all their transactions.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Universal Password (Verification)
            </label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password to confirm"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setCustomerToDelete('');
                setDeletePassword('');
              }}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCustomer}
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(to right, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Customer Ledger Page
function CustomerLedgerPage({ customerName, onBack }) {
  const [customer, setCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionTime, setTransactionTime] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  useEffect(() => {
    loadCustomer();
    const now = new Date();
    setTransactionDate(now.toISOString().split('T')[0]);
    setTransactionTime(now.toTimeString().slice(0, 5));
  }, [customerName]);

  function loadCustomer() {
    const data = getData();
    setCustomer(data.customers[customerName]);
  }

  function calculateBalance(filterMonth = null) {
    let totalCredit = 0;
    let totalPayment = 0;
    const transactions = filterMonth && filterMonth !== 'all'
      ? filterTransactionsByMonth(customer?.transactions || [], filterMonth)
      : customer?.transactions || [];
    
    transactions.forEach(t => {
      if (t.type === 'credit') totalCredit += t.amount;
      else if (t.type === 'payment') totalPayment += t.amount;
    });
    return totalCredit - totalPayment;
  }

  function handleAddTransaction() {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!transactionDate) {
      setError('Please select a date');
      return;
    }

    if (!transactionTime) {
      setError('Please select a time');
      return;
    }

    const data = getData();
    const transaction = {
      type: modalType,
      amount: parseFloat(amount),
      date: transactionDate,
      time: transactionTime,
      notes: modalType === 'credit' ? notes : undefined
    };

    data.customers[customerName].transactions.push(transaction);
    saveData(data);
    loadCustomer();
    setShowAddModal(false);
    setAmount('');
    setNotes('');
    setModalType('');
    const now = new Date();
    setTransactionDate(now.toISOString().split('T')[0]);
    setTransactionTime(now.toTimeString().slice(0, 5));
    setSuccess(`${modalType === 'credit' ? 'Credit' : 'Payment'} added successfully!`);
  }

  function handleDeleteEntry() {
    const data = getData();
    
    if (verifyPassword !== data.credentials.password) {
      setError('Invalid Password');
      return;
    }

    data.customers[customerName].transactions.splice(deleteIndex, 1);
    saveData(data);
    loadCustomer();
    setShowDeleteModal(false);
    setDeleteIndex(null);
    setVerifyPassword('');
    setSuccess('Transaction deleted successfully!');
  }

  if (!customer) return null;

  const monthYearOptions = getMonthYearOptions({ [customerName]: customer });
  const balance = calculateBalance(selectedMonth);
  const displayTransactions = selectedMonth !== 'all'
    ? filterTransactionsByMonth(customer.transactions || [], selectedMonth)
    : customer.transactions || [];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)' }}>
      {error && <Toast message={error} onClose={() => setError('')} type="error" />}
      {success && <Toast message={success} onClose={() => setSuccess('')} type="success" />}

      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={onBack}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              color: '#4b5563',
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{customerName}</h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Month Filter for Ledger */}
        <div style={{ 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#374151',
            fontWeight: '600'
          }}>
            <Calendar size={20} />
            <span>Filter by Month:</span>
          </div>
          <div style={{ position: 'relative', flex: '1', maxWidth: '300px' }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 36px 10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#1f2937',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <option value="all">All Time</option>
              {monthYearOptions.map(monthYear => (
                <option key={monthYear} value={monthYear}>
                  {formatMonthDisplay(monthYear)}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6b7280'
              }}
            />
          </div>
          {selectedMonth !== 'all' && (
            <button
              onClick={() => setSelectedMonth('all')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear Filter
            </button>
          )}
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{
            background: balance > 0 
              ? 'linear-gradient(to bottom right, #ef4444, #dc2626)'
              : balance < 0 
              ? 'linear-gradient(to bottom right, #10b981, #059669)'
              : 'linear-gradient(to bottom right, #6b7280, #4b5563)',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            padding: '32px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0, opacity: 0.9 }}>
                {balance > 0 ? 'TOTAL CREDIT (Due)' : balance < 0 ? 'TOTAL ADVANCE (Paid Extra)' : 'BALANCED'}
                {selectedMonth !== 'all' && <div style={{ fontSize: '14px', marginTop: '4px' }}>({formatMonthDisplay(selectedMonth)})</div>}
              </h3>
            </div>
            <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '8px 0' }}>
              ₹{Math.abs(balance).toLocaleString()}
            </p>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '8px 0 0 0' }}>
              {balance > 0 
                ? 'Customer owes you this amount' 
                : balance < 0 
                ? 'You owe customer this amount (advance payment)'
                : 'No outstanding balance'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => {
              setModalType('credit');
              setShowAddModal(true);
            }}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(to right, #ef4444, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            + Add Credit
          </button>
          <button
            onClick={() => {
              setModalType('payment');
              setShowAddModal(true);
            }}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(to right, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            + Add Payment
          </button>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', background: 'linear-gradient(to right, #a855f7, #ec4899)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Transaction History {selectedMonth !== 'all' && `(${formatMonthDisplay(selectedMonth)})`}
            </h2>
          </div>

          {displayTransactions.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
              <CreditCard size={64} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
              <p style={{ fontSize: '18px', margin: 0 }}>
                {selectedMonth !== 'all' ? 'No transactions in this month.' : 'No transactions yet. Add your first entry!'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <tr>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>
                      Date & Time
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>
                      Type
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>
                      Notes
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>
                      Amount
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayTransactions.map((transaction, index) => {
                    // Find original index for deletion
                    const originalIndex = customer.transactions.indexOf(transaction);
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px 24px', color: '#374151' }}>
                          <div style={{ fontWeight: '600' }}>
                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {transaction.time || 'N/A'}
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            padding: '6px 12px',
                            backgroundColor: transaction.type === 'credit' ? '#fee2e2' : '#d1fae5',
                            color: transaction.type === 'credit' ? '#991b1b' : '#065f46',
                            borderRadius: '9999px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            {transaction.type === 'credit' ? 'Credit' : 'Payment'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', color: '#374151', maxWidth: '200px' }}>
                          {transaction.notes ? (
                            <div style={{ 
                              fontSize: '14px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }} title={transaction.notes}>
                              {transaction.notes}
                            </div>
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '14px' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <span style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: transaction.type === 'credit' ? '#dc2626' : '#059669'
                          }}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          <button
                            onClick={() => {
                              setDeleteIndex(originalIndex);
                              setShowDeleteModal(true);
                            }}
                            style={{
                              padding: '8px',
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setAmount('');
          setNotes('');
          setModalType('');
          const now = new Date();
          setTransactionDate(now.toISOString().split('T')[0]);
          setTransactionTime(now.toTimeString().slice(0, 5));
        }}
        title={`Add ${modalType === 'credit' ? 'Credit' : 'Payment'}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {modalType === 'credit' && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Notes (Food items taken)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., 2x Biryani, 1x Butter Chicken, 3x Naan"
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Date
              </label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Time
              </label>
              <input
                type="time"
                value={transactionTime}
                onChange={(e) => setTransactionTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            onClick={handleAddTransaction}
            style={{
              width: '100%',
              padding: '14px',
              background: modalType === 'credit'
                ? 'linear-gradient(to right, #ef4444, #ec4899)'
                : 'linear-gradient(to right, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            Add {modalType === 'credit' ? 'Credit' : 'Payment'}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteIndex(null);
          setVerifyPassword('');
        }}
        title="Delete Transaction"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: '#374151', margin: 0 }}>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Universal Password (Verification)
            </label>
            <input
              type="password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteIndex(null);
                setVerifyPassword('');
              }}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteEntry}
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(to right, #ef4444, #ec4899)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Settings Page (keeping the same as before)
function SettingsPage({ onBack }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customers, setCustomers] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [newPIN, setNewPIN] = useState('');
  const [verifyPasswordForPIN, setVerifyPasswordForPIN] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  function loadCustomers() {
    const data = getData();
    setCustomers(data.customers);
  }

  function handleChangePassword() {
    const data = getData();

    if (currentPassword !== data.credentials.password) {
      setError('Current password is incorrect');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('New password must be at least 4 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    data.credentials.password = newPassword;
    saveData(data);
    
    setSuccess('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => setSuccess(''), 3000);
  }

  function handleChangePIN() {
    const data = getData();

    if (verifyPasswordForPIN !== data.credentials.password) {
      setError('Invalid Universal Password');
      return;
    }

    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }

    if (newPIN.length !== 4 || isNaN(newPIN)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    const existingPINs = Object.entries(data.customers)
      .filter(([name]) => name !== selectedCustomer)
      .map(([_, customer]) => customer.pin);
    
    if (existingPINs.includes(newPIN)) {
      setError('This PIN is already in use by another customer');
      return;
    }

    data.customers[selectedCustomer].pin = newPIN;
    saveData(data);
    
    setSuccess(`PIN changed successfully for ${selectedCustomer}!`);
    setSelectedCustomer('');
    setNewPIN('');
    setVerifyPasswordForPIN('');
    loadCustomers();
    
    setTimeout(() => setSuccess(''), 3000);
  }

  function handleExportToTXT() {
    const data = getData();
    const timestamp = new Date().toLocaleString('en-IN');
    let txtContent = `KINGG RESTAURANT LEDGER - BACKUP\n`;
    txtContent += `Generated: ${timestamp}\n`;
    txtContent += `${'='.repeat(80)}\n\n`;
    
    txtContent += `CUSTOMERS & TRANSACTIONS:\n\n`;
    
    if (Object.keys(data.customers).length === 0) {
      txtContent += `No customers yet.\n`;
    } else {
      Object.entries(data.customers).forEach(([name, customer], index) => {
        txtContent += `${index + 1}. CUSTOMER: ${name}\n`;
        
        let totalCredit = 0;
        let totalPayment = 0;
        customer.transactions?.forEach(t => {
          if (t.type === 'credit') totalCredit += t.amount;
          else if (t.type === 'payment') totalPayment += t.amount;
        });
        const balance = totalCredit - totalPayment;
        
        txtContent += `   Total Credit: ₹${totalCredit.toLocaleString()}\n`;
        txtContent += `   Total Payment: ₹${totalPayment.toLocaleString()}\n`;
        txtContent += `   Balance: ₹${Math.abs(balance).toLocaleString()} ${balance > 0 ? '(DUE)' : balance < 0 ? '(ADVANCE)' : '(BALANCED)'}\n\n`;
        
        if (customer.transactions && customer.transactions.length > 0) {
          txtContent += `   TRANSACTIONS:\n`;
          customer.transactions.forEach((t, tIndex) => {
            txtContent += `   ${tIndex + 1}. ${t.date} ${t.time || ''} | ${t.type.toUpperCase()} | ₹${t.amount.toLocaleString()}`;
            if (t.notes) {
              txtContent += ` | Notes: ${t.notes}`;
            }
            txtContent += `\n`;
          });
        } else {
          txtContent += `   No transactions yet.\n`;
        }
        
        txtContent += `\n${'-'.repeat(80)}\n\n`;
      });
    }
    
    txtContent += `\n${'='.repeat(80)}\n`;
    txtContent += `END OF BACKUP\n`;
    
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `KINGG-Ledger-Backup-${dateStr}.txt`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSuccess('Database exported to TXT file successfully!');
    setTimeout(() => setSuccess(''), 3000);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)' }}>
      {error && <Toast message={error} onClose={() => setError('')} type="error" />}
      {success && <Toast message={success} onClose={() => setSuccess('')} type="success" />}

      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={onBack}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              color: '#4b5563',
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Settings</h1>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Change Universal Password
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              onClick={handleChangePassword}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginTop: '8px'
              }}
            >
              Change Password
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Change Customer PIN
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Select Customer
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Select Customer --</option>
                {Object.entries(customers).map(([name]) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                New PIN (4 digits)
              </label>
              <input
                type="text"
                value={newPIN}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setNewPIN(value);
                }}
                placeholder="Enter new 4-digit PIN"
                maxLength="4"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Universal Password (Verification)
              </label>
              <input
                type="password"
                value={verifyPasswordForPIN}
                onChange={(e) => setVerifyPasswordForPIN(e.target.value)}
                placeholder="Enter universal password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              onClick={handleChangePIN}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(to right, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginTop: '8px'
              }}
            >
              Change Customer PIN
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Export Database
          </h2>
          
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
            Download your complete ledger data as a simple TXT file. This includes all customers, transactions, and balances.
          </p>

          <button
            onClick={handleExportToTXT}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(to right, #3b82f6, #6366f1)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            📥 Download Backup as TXT
          </button>
          
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
            File will be saved to your Downloads folder
          </p>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    initStorage();
  }, []);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  if (currentPage === 'settings') {
    return <SettingsPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'customer' && selectedCustomer) {
    return (
      <CustomerLedgerPage
        customerName={selectedCustomer}
        onBack={() => {
          setCurrentPage('home');
          setSelectedCustomer(null);
        }}
      />
    );
  }

  return (
    <HomePage
      onLogout={() => {
        setIsLoggedIn(false);
        setCurrentPage('home');
        setSelectedCustomer(null);
      }}
      onViewCustomer={(name) => {
        setSelectedCustomer(name);
        setCurrentPage('customer');
      }}
      onSettings={() => setCurrentPage('settings')}
    />
  );
}
