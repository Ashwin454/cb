import { Instagram, Linkedin } from 'lucide-react';
import { memo } from 'react';

function Footer() {
  return (
    <footer className='bg-black text-white mt-auto overflow-hidden'>
      <div className='container mx-auto px-4 py-8 max-w-full overflow-hidden'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='font-bold text-lg mb-4'>CampusBites</h3>
            <p className='text-gray-400 mb-4'>
              Delicious food delivered to your doorstep on campus.
            </p>
            <div className='flex space-x-4'>
              <a
                href='https://www.linkedin.com/company/campusbites-in/'
                className='text-gray-400 hover:text-white'
                target='_blank'
                rel='noopener noreferrer'>
                <Linkedin className='h-5 w-5' />
                <span className='sr-only'>LinkedIn</span>
              </a>
              <a
                href='https://www.instagram.com/campusbites_in/'
                className='text-gray-400 hover:text-white'
                target='_blank'
                rel='noopener noreferrer'>
                <Instagram className='h-5 w-5' />
                <span className='sr-only'>Instagram</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className='font-bold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <a href='/' className='text-gray-400 hover:text-white'>
                  Home
                </a>
              </li>
              <li>
                <a href='/menu' className='text-gray-400 hover:text-white'>
                  Menu
                </a>
              </li>
              <li>
                <a href='/orders' className='text-gray-400 hover:text-white'>
                  Orders
                </a>
              </li>
              <li>
                <a href='/cart' className='text-gray-400 hover:text-white'>
                  Cart
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-bold mb-4'>Information</h3>
            <ul className='space-y-2'>
              <li>
                <a href='/about' className='text-gray-400 hover:text-white'>
                  About Us
                </a>
              </li>
              <li>
                <a href='/faq' className='text-gray-400 hover:text-white'>
                  FAQ
                </a>
              </li>
              <li>
                <a href='/terms' className='text-gray-400 hover:text-white'>
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href='/privacy' className='text-gray-400 hover:text-white'>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-bold mb-4'>Contact Support</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='mailto:support@campusbites.in'
                  className='text-gray-400 hover:text-white'>
                  support@campusbites.in
                </a>
              </li>
              <li>
                <a
                  href='tel:+917529052525'
                  className='text-gray-400 hover:text-white'>
                  +91 75290 52525
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400'>
          <p className='mb-4'>
            By continuing past this page, you agree to our Terms of Service,
            Cookie Policy, Privacy Policy and Content Policies. All trademarks
            are properties of their respective owners.
          </p>
          <p>© {new Date().getFullYear()} Campus Bites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
