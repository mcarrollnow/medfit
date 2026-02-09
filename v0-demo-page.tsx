import GlobalNavigation from '@/v0-components/global-navigation'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Global Navigation - pass showCart={true} to show cart icon */}
      <GlobalNavigation showCart={true} />
      
      {/* Your Page Content Goes Here */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Demo Page with Global Navigation</h1>
        
        <section className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Your Page</h2>
            <p className="text-muted-foreground mb-4">
              This is a demo page showing how to integrate the global navigation header. 
              The header is fixed at the top and includes:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Logo and site title</li>
              <li>Search bar functionality</li>
              <li>Notification bell (when logged in)</li>
              <li>Shopping cart with item count</li>
              <li>Hamburger menu with navigation options</li>
            </ul>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">Adjusting Sizes</h3>
            <p className="text-muted-foreground mb-4">
              To adjust the size of elements in the header, modify these classes in the GlobalNavigation component:
            </p>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="bg-muted p-3 rounded">
                <span className="text-primary">Logo:</span> w-8 h-8 sm:w-10 sm:h-10
              </div>
              <div className="bg-muted p-3 rounded">
                <span className="text-primary">Title:</span> text-xl md:text-2xl (desktop) / text-lg (mobile)
              </div>
              <div className="bg-muted p-3 rounded">
                <span className="text-primary">Icons:</span> w-8 h-8 (cart/menu) / w-6 h-6 (bell)
              </div>
              <div className="bg-muted p-3 rounded">
                <span className="text-primary">Header Height:</span> h-16 sm:h-20 (spacer div)
              </div>
            </div>
          </div>
          
          {/* Add more content to test scrolling */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">Integration Notes</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Copy the component to your v0 project</li>
              <li>Import it in your pages/layouts</li>
              <li>Pass showCart prop to control cart visibility</li>
              <li>Replace mock data with your actual auth/cart logic</li>
              <li>Update the logo image source</li>
              <li>Customize colors and styles as needed</li>
            </ol>
          </div>
          
          {/* Extra content for scroll testing */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Content Block {i + 1}</h3>
              <p className="text-muted-foreground">
                This is additional content to test the fixed header behavior when scrolling.
                The header should stay fixed at the top while this content scrolls underneath.
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
