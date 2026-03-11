import React, { useState } from 'react';
import { AccountList } from '@/components/accounts/AccountList';
import { CreateAccountModal } from '@/components/accounts/CreateAccountModal';

const AccountsPage: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bank-text">My Accounts</h1>
        <p className="text-sm text-bank-muted mt-0.5">Manage all your bank accounts</p>
      </div>

      <AccountList onOpenCreate={() => setShowCreate(true)} />

      <CreateAccountModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
};

export default AccountsPage;
