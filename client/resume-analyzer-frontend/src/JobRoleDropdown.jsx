import React, { useState, useRef, useEffect } from 'react';

function JobRoleDropdown({ roles, selectedRole, setSelectedRole }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setFilter('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter roles based on search input
  const filteredRoles = roles.filter(role =>
    role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      className="dropdown-container"
      ref={dropdownRef}
      
    >
      <div
        className="dropdown-selected"
        onClick={() => setOpen(!open)}
        
      >
        {selectedRole || 'Select a job role'}
        <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>
          ▼
        </span>
      </div>

      {open && (
        <div
          className="dropdown-list"
          
        >
          <input
            type="text"
            placeholder="Search roles..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              marginBottom: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none'
            }}
          />
          {filteredRoles.length === 0 ? (
            <div style={{ padding: '8px', color: '#999', textAlign: 'center' }}>
              No matching roles
            </div>
          ) : (
            filteredRoles.map((role, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedRole(role);
                  setOpen(false);
                  setFilter('');
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  marginBottom: '4px',
                  transition: 'background-color 0.2s',
                  backgroundColor: selectedRole === role ? '#0077cc' : 'transparent',
                  color: selectedRole === role ? '#fff' : '#004080',
                  fontWeight: selectedRole === role ? '700' : '400'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cce4ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedRole === role ? '#0077cc' : 'transparent'}
              >
                {role}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default JobRoleDropdown;
