'use client'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { useState } from 'react'

export default function TenantPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const handleInviteUser = () => {
    setActiveSection('inviteUser')
  }

  const handleSendInvitation = () => {
    setActiveSection('sendInvitation')
  }

  const handleManageTemplates = () => {
    setActiveSection('manageTemplates')
  }

  const handleViewReports = () => {
    setActiveSection('viewReports')
  }

  const closeSection = () => {
    setActiveSection(null)
  }
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '32px', 
      background: 'linear-gradient(135deg, #08122e 0%, #243b53 100%)' 
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '24px' 
          }}>
            <NeoxLogo width="300px" height="60px" />
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '16px', color: '#d7bb91' }}>
            Tenant Admin Dashboard
          </h1>
          <p style={{ 
            maxWidth: '672px', 
            margin: '0 auto 32px auto', 
            color: '#d7bb91', 
            opacity: 0.8 
          }}>
            Welcome to your tenant administration panel. Manage users, invitations, and resources.
          </p>
        </div>

        {/* Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 55, 90, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              backgroundColor: 'rgba(215, 187, 145, 0.2)'
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#d7bb91' }}>Users</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d7bb91', opacity: 0.7 }}>Manage team members</p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d7bb91' }}>0</div>
          </div>

          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 55, 90, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              backgroundColor: 'rgba(215, 187, 145, 0.2)'
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#d7bb91' }}>Invitations</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d7bb91', opacity: 0.7 }}>Visitor management</p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d7bb91' }}>0</div>
          </div>

          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 55, 90, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              backgroundColor: 'rgba(215, 187, 145, 0.2)'
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#d7bb91' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#d7bb91' }}>Parking</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d7bb91', opacity: 0.7 }}>Space management</p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>Available</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 55, 90, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#d7bb91' }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d7bb91' }}></div>
                <span style={{ color: '#d7bb91', opacity: 0.7 }}>No recent activity</span>
              </div>
            </div>
          </div>

          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 55, 90, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(75, 101, 129, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#d7bb91' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleInviteUser} 
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(75, 101, 129, 0.9)'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(51, 78, 104, 0.8)'}
                style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>Invite User</button>
              <button onClick={handleSendInvitation} style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>Send Invitation</button>
              <button onClick={handleManageTemplates} style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>Manage Templates</button>
              <button onClick={handleViewReports} style={{
                backgroundColor: 'rgba(51, 78, 104, 0.8)',
                color: '#d7bb91',
                border: '1px solid rgba(75, 101, 129, 0.3)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}>View Reports</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px', color: '#d7bb91', opacity: 0.6 }}>
            ⚠️ Demo page - Database connection required
          </p>
          <Link href="/" style={{ 
            fontSize: '14px', 
            textDecoration: 'underline', 
            color: '#d7bb91',
            transition: 'opacity 0.2s'
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Modal Overlays for Different Sections */}
      {activeSection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(8, 18, 46, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(30, 55, 90, 0.95)',
            border: '1px solid rgba(75, 101, 129, 0.5)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d7bb91', margin: 0 }}>
                {activeSection === 'inviteUser' && 'Invite New User'}
                {activeSection === 'sendInvitation' && 'Send Visitor Invitation'}
                {activeSection === 'manageTemplates' && 'Manage Templates'}
                {activeSection === 'viewReports' && 'View Reports'}
              </h2>
              <button onClick={closeSection} style={{
                background: 'none',
                border: '1px solid rgba(215, 187, 145, 0.5)',
                borderRadius: '8px',
                color: '#d7bb91',
                fontSize: '20px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>×</button>
            </div>

            {activeSection === 'inviteUser' && (
              <div>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Full Name</label>
                    <input type="text" placeholder="Enter full name" style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.5)',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#d7bb91',
                      fontSize: '14px'
                    }} />
                  </div>
                  <div>
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email Address</label>
                    <input type="email" placeholder="user@company.com" style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.5)',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#d7bb91',
                      fontSize: '14px'
                    }} />
                  </div>
                  <div>
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Role</label>
                    <select style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.5)',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#d7bb91',
                      fontSize: '14px'
                    }}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Department</label>
                    <input type="text" placeholder="Enter department" style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.5)',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#d7bb91',
                      fontSize: '14px'
                    }} />
                  </div>
                  <button type="submit" style={{
                    backgroundColor: 'rgba(75, 101, 129, 0.8)',
                    color: '#d7bb91',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}>Send Invitation</button>
                </form>
              </div>
            )}

            {activeSection === 'sendInvitation' && (
              <div>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visitor Name</label>
                    <input type="text" placeholder="Enter visitor name" style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.5)',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#d7bb91',
                      fontSize: '14px'
                    }} />
                  </div>
                  <div>
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visitor Email</label>
                    <input type="email" placeholder="visitor@email.com" style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.5)',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#d7bb91',
                      fontSize: '14px'
                    }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visit Date</label>
                      <input type="date" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Visit Time</label>
                      <input type="time" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Purpose of Visit</label>
                    <textarea placeholder="Enter purpose of visit" style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.5)',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#d7bb91',
                      fontSize: '14px',
                      minHeight: '80px',
                      resize: 'vertical'
                    }} />
                  </div>
                  <button type="submit" style={{
                    backgroundColor: 'rgba(75, 101, 129, 0.8)',
                    color: '#d7bb91',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}>Send Invitation</button>
                </form>
              </div>
            )}

            {activeSection === 'manageTemplates' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <button style={{
                    backgroundColor: 'rgba(75, 101, 129, 0.6)',
                    color: '#d7bb91',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>+ New Template</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { name: 'Standard Meeting Invitation', type: 'Meeting', lastUsed: '2 days ago' },
                    { name: 'Visitor Access Badge', type: 'Access', lastUsed: '1 week ago' },
                    { name: 'Interview Invitation', type: 'Interview', lastUsed: '3 days ago' },
                    { name: 'Vendor Visit', type: 'Business', lastUsed: '1 day ago' }
                  ].map((template, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      backgroundColor: 'rgba(51, 78, 104, 0.3)',
                      borderRadius: '8px',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4 style={{ color: '#d7bb91', margin: '0 0 4px 0', fontSize: '16px' }}>{template.name}</h4>
                        <p style={{ color: '#d7bb91', opacity: 0.7, margin: '0', fontSize: '12px' }}>{template.type} • Last used {template.lastUsed}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          backgroundColor: 'rgba(75, 101, 129, 0.6)',
                          color: '#d7bb91',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>Edit</button>
                        <button style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.6)',
                          color: '#fff',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>Use</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'viewReports' && (
              <div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <select style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(51, 78, 104, 0.5)',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#d7bb91',
                    fontSize: '14px'
                  }}>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                  <button style={{
                    backgroundColor: 'rgba(75, 101, 129, 0.6)',
                    color: '#d7bb91',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>Export</button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'rgba(51, 78, 104, 0.3)',
                    borderRadius: '8px',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#d7bb91', fontSize: '24px', fontWeight: 'bold' }}>47</div>
                    <div style={{ color: '#d7bb91', opacity: 0.7, fontSize: '14px' }}>Total Invitations</div>
                  </div>
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'rgba(51, 78, 104, 0.3)',
                    borderRadius: '8px',
                    border: '1px solid rgba(75, 101, 129, 0.3)',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>32</div>
                    <div style={{ color: '#d7bb91', opacity: 0.7, fontSize: '14px' }}>Accepted</div>
                  </div>
                </div>
                
                <div style={{ maxHeight: '250px', overflow: 'auto' }}>
                  <h4 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px' }}>Recent Activity</h4>
                  {[
                    { name: 'John Smith', action: 'Accepted invitation', time: '2 hours ago', status: 'success' },
                    { name: 'Sarah Johnson', action: 'Declined invitation', time: '4 hours ago', status: 'declined' },
                    { name: 'Mike Davis', action: 'Invitation sent', time: '6 hours ago', status: 'pending' },
                    { name: 'Lisa Wilson', action: 'Visited office', time: '1 day ago', status: 'completed' }
                  ].map((activity, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.2)',
                      borderRadius: '8px',
                      border: '1px solid rgba(75, 101, 129, 0.2)',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500' }}>{activity.name}</div>
                        <div style={{ color: '#d7bb91', opacity: 0.7, fontSize: '12px' }}>{activity.action} • {activity.time}</div>
                      </div>
                      <span style={{
                        backgroundColor: activity.status === 'success' ? 'rgba(34, 197, 94, 0.3)' : 
                                         activity.status === 'declined' ? 'rgba(239, 68, 68, 0.3)' :
                                         activity.status === 'completed' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(234, 179, 8, 0.3)',
                        color: activity.status === 'success' ? '#10b981' : 
                               activity.status === 'declined' ? '#ef4444' :
                               activity.status === 'completed' ? '#3b82f6' : '#eab308',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>{activity.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
