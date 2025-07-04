import React from 'react';

const ClientTabs = () => {
    return (
        <div>
            <h1>Client Management</h1>
            <p>Manage your clients here.</p>
            {/* Add more client functionalities here */}
            <ul>
                <li><a href="/admin/clients/add">Add Client</a></li>
                <li><a href="/admin/clients/list">List Clients</a></li>
                <li><a href="/admin/clients/edit">Edit Client</a></li>
                <li><a href="/admin/clients/delete">Delete Client</a></li>
            </ul>
        </div>
    );
}

export default ClientTabs;
