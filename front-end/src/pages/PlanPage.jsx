import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import assets from '../assets/assets';

// Map service category to an image
const categoryImages = {
  'Marketing & Promotion': assets.ads_icon,
  'Content & Media': assets.content_icon,
  'Technology & Tools': assets.marketing_icon,
  'Education & Learning': assets.social_icon,
  'Entertainment & Lifestyle': assets.social_icon,
  'Business Services': assets.marketing_icon,
};

const PlanPage = () => {
  const [billingType, setBillingType] = React.useState('monthly');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [subscribing, setSubscribing] = React.useState(false);
  const [subscribeMsg, setSubscribeMsg] = React.useState('');
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  // Fetch current user on mount
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);
  const servicesPerPage = 5;

  React.useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/services-with-plans')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Get unique categories from fetched data
  const categories = [
    'All',
    ...Array.from(new Set(services.map(s => s.category)))
  ];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4 sm:px-10 lg:px-24 xl:px-40">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700 dark:text-indigo-200">Available Plans</h1>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        {/* Filter Dropdown */}
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-indigo-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-indigo-700 dark:text-indigo-200 font-semibold shadow"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="inline-flex rounded-full bg-indigo-100 dark:bg-gray-800 p-1">
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${billingType === 'monthly' ? 'bg-indigo-600 text-white' : 'text-indigo-700 dark:text-indigo-200'}`}
            onClick={() => setBillingType('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${billingType === 'yearly' ? 'bg-indigo-600 text-white' : 'text-indigo-700 dark:text-indigo-200'}`}
            onClick={() => setBillingType('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-lg text-gray-500 dark:text-gray-300">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col gap-12 max-w-4xl mx-auto">
            {paginatedServices.map((service) => (
              <div key={service.id} className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Service Image */}
              <div className="flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-8 md:w-64">
                <img
                  src={categoryImages[service.category] || assets.ads_icon}
                  alt={service.title}
                  className="w-24 h-24 object-contain rounded-full shadow-lg border-4 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900"
                />
              </div>
              {/* Service Info and Plans */}
              <div className="flex-1 p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-300 mb-2">{service.title}</h2>
                <p className="mb-6 text-gray-700 dark:text-gray-300">{service.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {service.plans
                    .filter(plan => plan.type === billingType)
                    .map((plan) => (
                      <div key={plan.id} className="flex flex-col items-center border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900 hover:shadow-xl transition-all">
                        {/* You can add plan images/icons here if needed */}
                        <span className="font-bold text-lg mb-2 text-indigo-700 dark:text-indigo-200">{plan.name}</span>
                        <span className="text-gray-600 dark:text-gray-300 mb-4">
                          ₹{plan.price}/{plan.type}
                        </span>
                        <button
                          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                          onClick={() => {
                            setSelectedPlan({ plan, service });
                            setShowConfirm(true);
                          }}
                        >
                          Subscribe
                        </button>
      {/* Confirmation Modal */}
      {showConfirm && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-200">Are you sure?</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300 text-center">
              Subscribe to <span className="font-semibold">{selectedPlan.plan.name}</span> for <span className="font-semibold">₹{selectedPlan.plan.price}/{selectedPlan.plan.type}</span> in <span className="font-semibold">{selectedPlan.service.title}</span>?
            </p>
            {subscribeMsg && <div className="mb-2 text-green-600 dark:text-green-400">{subscribeMsg}</div>}
            <div className="flex gap-4 mt-2">
              <button
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                disabled={subscribing}
                onClick={async () => {
                  setSubscribing(true);
                  setSubscribeMsg('');
                  if (!user) {
                    setSubscribeMsg('You must be logged in to subscribe.');
                    setSubscribing(false);
                    return;
                  }
                  // Insert subscription into Supabase with user_id
                  const { error } = await supabase.from('subscriptions').insert([
                    {
                      user_id: user.id,
                      plan_id: selectedPlan.plan.id,
                      service_id: selectedPlan.service.id,
                      plan_name: selectedPlan.plan.name,
                      price: selectedPlan.plan.price,
                      type: selectedPlan.plan.type,
                      currency: selectedPlan.plan.currency,
                      service_title: selectedPlan.service.title,
                      created_at: new Date().toISOString(),
                    },
                  ]);
                  setSubscribing(false);
                  if (error) {
                    setSubscribeMsg('Failed to subscribe. Please try again.');
                  } else {
                    setSubscribeMsg('Subscription successful!');
                    setTimeout(() => {
                      setShowConfirm(false);
                      setSelectedPlan(null);
                      setSubscribeMsg('');
                      // Optionally reload subscriptions or page
                      navigate('/plan');
                    }, 1200);
                  }
                }}
              >
                {subscribing ? 'Subscribing...' : 'Yes, Subscribe'}
              </button>
              <button
                className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium"
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedPlan(null);
                  setSubscribeMsg('');
                }}
                disabled={subscribing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 mb-8">
              <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-4 py-2 border border-indigo-200 dark:border-gray-700 text-indigo-700 dark:text-indigo-200 bg-white dark:bg-gray-900 font-semibold ${currentPage === idx + 1 ? 'bg-indigo-600 text-white' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlanPage;
