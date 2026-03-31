import { Link, useLocation } from 'react-router-dom';
import { WalletControl } from './WalletControl';

const NAV_ITEMS = [
  { to: '/', label: 'Marketplace' },
  { to: '/upload', label: 'Upload' },
  { to: '/intel', label: 'My Intel' },
];

export function NavBar() {
  const location = useLocation();

  return (
    <nav className="border-b border-broker-border bg-broker-bg-deep">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-gray-100 font-mono font-bold text-base tracking-wide">
              SHADOW BROKER
            </span>
            <span className="label-muted hidden sm:inline">PROTOCOL</span>
          </Link>
          <div className="flex gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-xs font-mono tracking-wide transition-colors whitespace-nowrap ${
                  location.pathname === item.to
                    ? 'text-broker-accent'
                    : 'text-broker-muted-light hover:text-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="shrink-0 ml-4">
          <WalletControl />
        </div>
      </div>
    </nav>
  );
}
