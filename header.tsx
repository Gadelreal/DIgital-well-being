"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Menu, X, Package, Wrench, BookOpen, Users, FileText, HelpCircle } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setActiveDropdown(null)
  }

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    alert("¡Bienvenido! Has iniciado sesión correctamente.")
  }

  const handleSignup = () => {
    alert("¡Registro exitoso! Bienvenido a Untitled UI.")
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setActiveDropdown(null)
    alert("Has cerrado sesión correctamente.")
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const dropdownMenus = {
    products: [
      { name: "Web Design", icon: Package, description: "Beautiful, responsive websites" },
      { name: "Mobile Apps", icon: Package, description: "iOS and Android applications" },
      { name: "E-commerce", icon: Package, description: "Online store solutions" },
      { name: "Analytics", icon: Package, description: "Data insights and reporting" },
    ],
    services: [
      { name: "Consulting", icon: Wrench, description: "Strategic business guidance" },
      { name: "Development", icon: Wrench, description: "Custom software solutions" },
      { name: "Support", icon: Wrench, description: "24/7 technical assistance" },
      { name: "Training", icon: Wrench, description: "Team skill development" },
    ],
    resources: [
      { name: "Documentation", icon: BookOpen, description: "Complete guides and tutorials" },
      { name: "Blog", icon: FileText, description: "Latest insights and updates" },
      { name: "Community", icon: Users, description: "Connect with other users" },
      { name: "Help Center", icon: HelpCircle, description: "Get support and answers" },
    ],
  }

  return (
    <header className="bg-[#ffffff] border-b border-[#e9eaeb] sticky top-0 z-50" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#6941c6] rounded-full flex items-center justify-center hover:bg-[#5a37b8] transition-colors">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <h1 className="text-xl font-semibold text-[#181d27] hover:text-[#6941c6] transition-colors">Untitled UI</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("products")}
                className={`flex items-center space-x-1 font-medium transition-colors ${
                  activeDropdown === "products" ? "text-[#6941c6]" : "text-[#535862] hover:text-[#181d27]"
                }`}
              >
                <span>Products</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeDropdown === "products" ? "rotate-180" : ""}`}
                />
              </button>

              {activeDropdown === "products" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#e9eaeb] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {dropdownMenus.products.map((item, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-[#f5f5f5] transition-colors flex items-start space-x-3"
                      onClick={() => {
                        setActiveDropdown(null)
                        alert(`Navegando a ${item.name}`)
                      }}
                    >
                      <item.icon className="w-5 h-5 text-[#6941c6] mt-0.5" />
                      <div>
                        <div className="font-medium text-[#181d27]">{item.name}</div>
                        <div className="text-sm text-[#535862]">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("services")}
                className={`flex items-center space-x-1 font-medium transition-colors ${
                  activeDropdown === "services" ? "text-[#6941c6]" : "text-[#535862] hover:text-[#181d27]"
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeDropdown === "services" ? "rotate-180" : ""}`}
                />
              </button>

              {activeDropdown === "services" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#e9eaeb] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {dropdownMenus.services.map((item, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-[#f5f5f5] transition-colors flex items-start space-x-3"
                      onClick={() => {
                        setActiveDropdown(null)
                        alert(`Navegando a ${item.name}`)
                      }}
                    >
                      <item.icon className="w-5 h-5 text-[#6941c6] mt-0.5" />
                      <div>
                        <div className="font-medium text-[#181d27]">{item.name}</div>
                        <div className="text-sm text-[#535862]">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing Link */}
            <button
              className="text-[#535862] hover:text-[#181d27] transition-colors font-medium hover:scale-105 transform duration-200"
              onClick={() => (window.location.href = "/pricing")}
            >
              Pricing
            </button>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("resources")}
                className={`flex items-center space-x-1 font-medium transition-colors ${
                  activeDropdown === "resources" ? "text-[#6941c6]" : "text-[#535862] hover:text-[#181d27]"
                }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeDropdown === "resources" ? "rotate-180" : ""}`}
                />
              </button>

              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#e9eaeb] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {dropdownMenus.resources.map((item, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-[#f5f5f5] transition-colors flex items-start space-x-3"
                      onClick={() => {
                        setActiveDropdown(null)
                        alert(`Navegando a ${item.name}`)
                      }}
                    >
                      <item.icon className="w-5 h-5 text-[#6941c6] mt-0.5" />
                      <div>
                        <div className="font-medium text-[#181d27]">{item.name}</div>
                        <div className="text-sm text-[#535862]">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About Link */}
            <button
              className="text-[#535862] hover:text-[#181d27] transition-colors font-medium hover:scale-105 transform duration-200"
              onClick={() => alert("Navegando a About")}
            >
              About
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 text-[#535862] hover:text-[#181d27] font-medium transition-all duration-200 hover:bg-[#f5f5f5] rounded-lg"
                >
                  Log in
                </button>
                <button
                  onClick={handleSignup}
                  className="bg-[#6941c6] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a37b8] transition-all duration-200 hover:scale-105 transform active:scale-95"
                >
                  Sign up
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("user")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#f5f5f5] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#6941c6] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">U</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#535862] transition-transform ${
                      activeDropdown === "user" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeDropdown === "user" && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e9eaeb] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button className="w-full px-4 py-2 text-left hover:bg-[#f5f5f5] transition-colors text-[#181d27]">
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-[#f5f5f5] transition-colors text-[#181d27]">
                      Settings
                    </button>
                    <hr className="my-2 border-[#e9eaeb]" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-[#f5f5f5] transition-colors text-red-600"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#535862] hover:text-[#181d27] transition-all duration-200 hover:bg-[#f5f5f5] p-2 rounded-lg"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#e9eaeb] animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Dropdowns */}
              {Object.entries(dropdownMenus).map(([key, items]) => (
                <div key={key}>
                  <button
                    onClick={() => toggleDropdown(`mobile-${key}`)}
                    className="flex items-center justify-between w-full px-3 py-2 text-[#535862] font-medium hover:text-[#181d27] transition-colors"
                  >
                    <span className="capitalize">{key}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeDropdown === `mobile-${key}` ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeDropdown === `mobile-${key}` && (
                    <div className="pl-6 space-y-1 animate-in slide-in-from-top duration-200">
                      {items.map((item, index) => (
                        <button
                          key={index}
                          className="block w-full text-left px-3 py-2 text-sm text-[#535862] hover:text-[#181d27] transition-colors"
                          onClick={() => {
                            setIsMenuOpen(false)
                            setActiveDropdown(null)
                            alert(`Navegando a ${item.name}`)
                          }}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                className="block w-full text-left px-3 py-2 text-[#535862] font-medium hover:text-[#181d27] transition-colors"
                onClick={() => {
                  setIsMenuOpen(false)
                  window.location.href = "/pricing"
                }}
              >
                Pricing
              </button>

              <button
                className="block w-full text-left px-3 py-2 text-[#535862] font-medium hover:text-[#181d27] transition-colors"
                onClick={() => {
                  setIsMenuOpen(false)
                  alert("Navegando a About")
                }}
              >
                About
              </button>

              {/* Mobile Auth Buttons */}
              <div className="px-3 py-2 space-y-2 border-t border-[#e9eaeb] mt-2 pt-4">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        handleLogin()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-[#535862] font-medium hover:text-[#181d27] transition-colors"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        handleSignup()
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-[#6941c6] text-white px-3 py-2 rounded-lg font-medium hover:bg-[#5a37b8] transition-colors"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 transition-colors rounded-lg"
                  >
                    Log out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
