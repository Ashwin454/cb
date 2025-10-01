import React, { useEffect } from "react";

const RefundPolicy = () => {
  useEffect(() => {
    // Set body and html background to dark navy
    document.body.style.backgroundColor = "#0f172a"; // slate-900
    document.documentElement.style.backgroundColor = "#0f172a";
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Campus Bites
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 font-medium">
                by SMARTDESH TECHNOLOGIES LLP
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-4 sm:px-8 py-6 sm:py-10 border-b border-gray-700">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Refund Policy
            </h2>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">
                  <span className="font-semibold">Effective Date:</span>{" "}
                  01/08/2025
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">
                  <span className="font-semibold">Entity:</span> SMARTDESH
                  TECHNOLOGIES LLP
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Introduction */}
            <div className="mb-8 sm:mb-10">
              <div className="relative p-4 sm:p-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl border-l-4 border-blue-500 shadow-sm">
                <div className="absolute top-4 right-4">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-200 leading-relaxed text-base sm:text-lg">
                  At Campus Bites, customer satisfaction is our top priority. We
                  strive to ensure that every order placed through our platform
                  is delivered promptly and as expected. This Refund Policy
                  outlines the circumstances under which refunds may be issued.
                </p>
              </div>
            </div>

            {/* Policy Sections */}
            <div className="space-y-8 sm:space-y-10">
              {/* Order Cancellations */}
              <section className="group">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-bold text-base sm:text-lg">
                        1
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      Order Cancellations
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          Orders may be cancelled by the customer only before
                          the canteen/vendor confirms the order.
                        </p>
                      </div>
                      <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          Once an order is confirmed by the vendor, cancellation
                          may not be possible.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refunds for Cancelled Orders */}
              <section className="group">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-bold text-base sm:text-lg">
                        2
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      Refunds for Cancelled Orders
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          If an order is cancelled before confirmation, the full
                          amount paid will be refunded to the original payment
                          method within 7–14 business days.
                        </p>
                      </div>
                      <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          Refunds will be Credited within{" "}
                          <span className="font-bold text-green-400 bg-green-900/30 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm">
                            7–14 business days
                          </span>
                          , subject to the policies of the respective banks and
                          payment gateways.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Non-Delivery */}
              <section className="group">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-bold text-base sm:text-lg">
                        3
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      Non-Delivery of Orders
                    </h3>
                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        In cases where an order is not delivered due to vendor
                        or operational issues, customers will be eligible for a
                        full refund of the order value.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quality & Food-Related Complaints */}
              <section className="group">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-bold text-base sm:text-lg">
                        4
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      Quality & Food-Related Complaints
                    </h3>
                    <div className="relative p-4 sm:p-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl border-l-4 border-yellow-500 shadow-sm">
                      <div className="absolute top-4 right-4">
                        <svg
                          className="w-6 h-6 text-yellow-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                        <span className="font-bold text-yellow-400">
                          Important:
                        </span>{" "}
                        Campus Bites is a technology platform that connects
                        students with campus canteens. Food quality, taste, and
                        preparation are the sole responsibility of the
                        respective vendor/canteen.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Mode of Refund */}
              <section className="group">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-bold text-base sm:text-lg">
                        5
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      Mode of Refund
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          All refunds will be credited to the original mode of
                          payment (UPI, card, wallet, etc.).
                        </p>
                      </div>
                      <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          In the case of Cash on Delivery (COD), eligible
                          refunds will be issued as wallet credits or bank
                          transfers upon verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Exclusions */}
              <section className="group">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-bold text-base sm:text-lg">
                        6
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      When Refunds Will Not Be Provided
                    </h3>
                    <div className="relative p-4 sm:p-6 bg-gradient-to-r from-red-900/20 to-pink-900/20 rounded-xl border-l-4 border-red-500 shadow-sm">
                      <div className="absolute top-4 right-4">
                        <svg
                          className="w-6 h-6 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base text-gray-200 font-semibold mb-3 sm:mb-4">
                        Refunds will not be provided in the following cases:
                      </p>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            The customer provides an incorrect delivery address
                            or is unavailable to accept the order.
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            Delays occur due to factors beyond our control
                            (traffic, weather, operational restrictions).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Contact Information */}
            <div className="mt-12 sm:mt-16">
              <div className="relative overflow-hidden p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl border border-gray-600 shadow-lg">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Questions or Concerns?
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                    If you have any questions about this refund policy or need
                    assistance with your order, please contact our customer
                    support team through the Campus Bites app or website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12 sm:mt-16">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">
              © 2025 SMARTDESH TECHNOLOGIES LLP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RefundPolicy;
