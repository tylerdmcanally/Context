import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4 text-black">Context</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              One deeply researched news story per day.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-black">Product</h4>
            <ul className="space-y-3 text-sm text-black/60">
              <li><Link href="/archive" className="hover:text-black transition-colors">Archive</Link></li>
              <li><Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-black">Account</h4>
            <ul className="space-y-3 text-sm text-black/60">
              <li><Link href="/settings" className="hover:text-black transition-colors">Settings</Link></li>
              <li><Link href="/library" className="hover:text-black transition-colors">Library</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-black">Legal</h4>
            <ul className="space-y-3 text-sm text-black/60">
              <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-black transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-black/10 text-center text-sm text-black/60">
          <p>© {new Date().getFullYear()} Context. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

