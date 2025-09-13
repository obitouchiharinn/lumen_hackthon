import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'upgrade' | 'downgrade' | 'delete'
  const [selectedSub, setSelectedSub] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setSubscriptions(data || []);
        setLoading(false);
      });
  }, [user]);

  // Delete logic with confirmation modal
  const handleDelete = (sub) => {
    setSelectedSub(sub);
    setModalType('delete');
    setShowModal(true);
  };

  // Upgrade/Downgrade logic with plan selection modal
  const handleUpgrade = async (sub) => {
    setActionLoading(true);
    setSelectedSub(sub);
    setModalType('upgrade');
    const { data: plans } = await supabase
      .from('plans')
      .select('*')
      .eq('service_id', sub.service_id)
      .gt('price', sub.price)
      .order('price', { ascending: true });
    setAvailablePlans(plans || []);
    setSelectedPlanId(plans && plans.length > 0 ? String(plans[0].id) : null);
    setShowModal(true);
    setActionLoading(false);
  };

  const handleDowngrade = async (sub) => {
    setActionLoading(true);
    setSelectedSub(sub);
    setModalType('downgrade');
    const { data: plans } = await supabase
      .from('plans')
      .select('*')
      .eq('service_id', sub.service_id)
      .lt('price', sub.price)
      .order('price', { ascending: false });
    setAvailablePlans(plans || []);
    setSelectedPlanId(plans && plans.length > 0 ? String(plans[0].id) : null);
    setShowModal(true);
    setActionLoading(false);
  };

  // Confirm action for modal
  const handleConfirm = async () => {
    setActionLoading(true);
    if (modalType === 'delete' && selectedSub) {
      await supabase.from('subscriptions').delete().eq('id', selectedSub.id);
      setSubscriptions(subscriptions.filter(sub => sub.id !== selectedSub.id));
    } else if ((modalType === 'upgrade' || modalType === 'downgrade') && selectedSub && selectedPlanId) {
      const plan = availablePlans.find(p => String(p.id) === String(selectedPlanId));
      if (plan) {
        await supabase.from('subscriptions').update({
          plan_id: plan.id,
          plan_name: plan.name,
          price: plan.price,
          type: plan.type,
          currency: plan.currency,
          created_at: new Date().toISOString(),
        }).eq('id', selectedSub.id);

        setSubscriptions(subscriptions.map(sub =>
          sub.id === selectedSub.id
            ? { ...sub, plan_id: plan.id, plan_name: plan.name, price: plan.price, type: plan.type, currency: plan.currency, created_at: new Date().toISOString() }
            : sub
        ));
      }
    }
    setShowModal(false);
    setSelectedSub(null);
    setAvailablePlans([]);
    setSelectedPlanId(null);
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 py-12 px-4 sm:px-10 lg:px-24 xl:px-40">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 dark:text-indigo-200 tracking-tight drop-shadow-lg">My Subscriptions</h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-lg text-gray-500 dark:text-gray-300 animate-pulse">Loading...</span>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-lg text-gray-500 dark:text-gray-300">No subscriptions found.</span>
        </div>
      ) : (
        <div className="grid gap-8 max-w-4xl mx-auto">
          {subscriptions.map(sub => (
            <div key={sub.id} className="flex flex-col md:flex-row bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl border border-indigo-100 dark:border-gray-700 overflow-hidden p-8 items-center justify-between transition-transform hover:scale-[1.02] hover:shadow-indigo-200 dark:hover:shadow-indigo-900">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-200 mb-1 truncate">{sub.plan_name}</h2>
                <div className="text-base text-gray-700 dark:text-gray-300 mb-2 font-medium truncate">{sub.service_title}</div>
                <div className="text-lg text-indigo-600 dark:text-indigo-300 mb-2 font-semibold">₹{sub.price} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ {sub.type}</span></div>
                <div className="text-xs text-gray-400">Subscribed on: {new Date(sub.created_at).toLocaleString()}</div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mt-6 md:mt-0 md:ml-8">
                <button onClick={() => handleUpgrade(sub)} className="px-5 py-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-xl font-semibold shadow transition-all">Upgrade</button>
                <button onClick={() => handleDowngrade(sub)} className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-xl font-semibold shadow transition-all">Downgrade</button>
                <button onClick={() => handleDelete(sub)} className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-xl font-semibold shadow transition-all">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal (moved outside .map) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            {modalType === 'delete' && selectedSub && (
              <>
                <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-300">Delete Subscription?</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-center">
                  Are you sure you want to delete your subscription to <span className="font-semibold">{selectedSub.plan_name}</span>?
                </p>
                <div className="flex gap-4 mt-2">
                  <button
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                    disabled={actionLoading}
                    onClick={handleConfirm}
                  >
                    {actionLoading ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium"
                    onClick={() => setShowModal(false)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {(modalType === 'upgrade' || modalType === 'downgrade') && selectedSub && (
              <>
                <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-200">
                  {modalType === 'upgrade' ? 'Upgrade' : 'Downgrade'} Subscription
                </h3>
                {availablePlans.length === 0 ? (
                  <div className="mb-4 text-gray-700 dark:text-gray-300 text-center">
                    No {modalType === 'upgrade' ? 'higher' : 'lower'} plans available for this service.
                  </div>
                ) : (
                  <>
                    <label className="mb-2 text-gray-700 dark:text-gray-300">Select a plan:</label>
                    <select
                      className="mb-4 px-4 py-2 rounded-lg border border-indigo-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-indigo-700 dark:text-indigo-200 font-semibold shadow"
                      value={selectedPlanId}
                      onChange={e => setSelectedPlanId(e.target.value)}
                      disabled={actionLoading}
                    >
                      {availablePlans.map(plan => (
                        <option key={plan.id} value={String(plan.id)}>
                          {plan.name} - ₹{plan.price} / {plan.type}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <div className="flex gap-4 mt-2">
                  <button
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                    disabled={actionLoading || availablePlans.length === 0}
                    onClick={handleConfirm}
                  >
                    {actionLoading
                      ? modalType === 'upgrade'
                        ? 'Upgrading...'
                        : 'Downgrading...'
                      : modalType === 'upgrade'
                      ? 'Upgrade'
                      : 'Downgrade'}
                  </button>
                  <button
                    className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium"
                    onClick={() => setShowModal(false)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;
