document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('btn-theme-toggle');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('btn-toggle-menu');
  
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const openDrawerBtn = document.getElementById('btn-open-drawer');
  const closeDrawerBtn = document.getElementById('btn-close-drawer');
  const saveDrawerBtn = document.getElementById('btn-save-drawer');
  const drawerForm = document.getElementById('drawer-form');

  const modal = document.getElementById('modal-confirm');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalHostName = document.getElementById('modal-host-name');
  const serversTableBody = document.getElementById('servers-table-body');
  const serverStatusFilter = document.getElementById('server-status-filter');
  const cancelModalBtn = document.getElementById('btn-cancel-modal');
  const confirmActionBtn = document.getElementById('btn-confirm-action');
  const servers = [
    { host: 'us-east-prod-01', zone: 'us-1a', ip: '10.0.4.12', cpu: 39, status: 'Operativo' },
    { host: 'us-east-prod-02', zone: 'us-1b', ip: '10.0.4.18', cpu: 57, status: 'Operativo' }
  ];

  const renderServers = () => {
    const status = serverStatusFilter.value;
    const filteredServers = servers.filter(server => {
      return status === 'all' || server.status === status;
    });
    serversTableBody.replaceChildren();
    if (filteredServers.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 6;
      cell.className = 'table-empty';
      cell.textContent = 'No se encontraron servidores con esos filtros.';
      row.append(cell);
      serversTableBody.append(row);
    } else {
      filteredServers.forEach(server => {
        const row = document.createElement('tr');
        const values = [server.host.replace('us-east-', 'us-'), server.zone, server.ip, `${server.cpu}%`];
        values.forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        });

        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge status-${server.status.toLocaleLowerCase()}`;
        statusBadge.textContent = server.status;
        statusCell.append(statusBadge);
        row.append(statusCell);

        const actionCell = document.createElement('td');
        const restartButton = document.createElement('button');
        restartButton.type = 'button';
        restartButton.className = 'btn btn-danger btn-restart';
        restartButton.dataset.host = server.host;
        restartButton.textContent = 'Reiniciar';
        actionCell.append(restartButton);
        row.append(actionCell);
        serversTableBody.append(row);
      });
    }

  };

  serverStatusFilter.addEventListener('change', renderServers);
  serversTableBody.addEventListener('click', event => {
    const restartBtn = event.target.closest('.btn-restart');
    if (restartBtn) openModal(restartBtn.dataset.host, restartBtn);
  });
  renderServers();

  
  themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  });

  
  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      sidebar.classList.toggle('is-collapsed');
      sidebar.classList.remove('is-open');
      return;
    }

    sidebar.classList.toggle('is-open');
    sidebar.classList.remove('is-collapsed');
  };

  menuToggle.addEventListener('click', toggleSidebar);

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      sidebar.classList.remove('is-open');
    } else {
      sidebar.classList.remove('is-collapsed');
    }
  });


  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawerOverlay.classList.add('is-visible');
    closeDrawerBtn.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawerOverlay.classList.remove('is-visible');
    openDrawerBtn.focus();
  };

  openDrawerBtn.addEventListener('click', openDrawer);
  closeDrawerBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  drawerForm.addEventListener('submit', event => {
    event.preventDefault();
    saveDrawerBtn.classList.add('is-loading');
    saveDrawerBtn.disabled = true;

    setTimeout(() => {
      saveDrawerBtn.classList.remove('is-loading');
      saveDrawerBtn.disabled = false;
      closeDrawer();
    }, 1500);
  });

  let lastTriggerBtn = null;

  const openModal = (host, btnElement) => {
    lastTriggerBtn = btnElement;
    modalHostName.textContent = host.replace('us-east-', 'us-');
    modal.classList.add('is-open');
    modalBackdrop.classList.add('is-visible');
    cancelModalBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modalBackdrop.classList.remove('is-visible');
    if (lastTriggerBtn) lastTriggerBtn.focus();
  };

  cancelModalBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  confirmActionBtn.addEventListener('click', () => {
    confirmActionBtn.classList.add('is-loading');
    confirmActionBtn.disabled = true;

    setTimeout(() => {
      confirmActionBtn.classList.remove('is-loading');
      confirmActionBtn.disabled = false;
      closeModal();
    }, 1500);
  });

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('is-open')) {
        closeModal();
      } else if (drawer.classList.contains('is-open')) {
        closeDrawer();
      } else if (sidebar.classList.contains('is-open')) {
        sidebar.classList.remove('is-open');
      }
    }
  });
});