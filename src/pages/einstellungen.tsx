import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  FiUser, 
  FiUsers, 
  FiEdit, 
  FiTrash2, 
  FiUpload, 
  FiPlusCircle,
  FiCheck,
  FiX,
  FiSave,
  FiRefreshCw,
  FiHome,
  FiLock,
  FiSettings
} from 'react-icons/fi';

// Typdefinitionen direkt in dieser Datei
type UserRole = 'admin' | 'manager' | 'employee';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
}

interface CompanySettings {
  id: string;
  name: string;
  address: string;
  taxId: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  bankAccount: {
    name: string;
    iban: string;
    bic: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock-Daten für Benutzer
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@selma-druckerei.de',
    name: 'Admin Benutzer',
    role: 'admin',
    avatar: '',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    lastLogin: '2024-05-01T09:30:00Z',
    isActive: true,
  },
  {
    id: '2',
    email: 'max.mustermann@selma-druckerei.de',
    name: 'Max Mustermann',
    role: 'manager',
    avatar: '',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
    lastLogin: '2024-04-28T14:20:00Z',
    isActive: true,
  },
  {
    id: '3',
    email: 'erika.musterfrau@selma-druckerei.de',
    name: 'Erika Musterfrau',
    role: 'employee',
    avatar: '',
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z',
    lastLogin: '2024-04-30T11:45:00Z',
    isActive: true,
  },
  {
    id: '4',
    email: 'thomas.schmidt@selma-druckerei.de',
    name: 'Thomas Schmidt',
    role: 'employee',
    avatar: '',
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-03-10T00:00:00Z',
    lastLogin: '2024-05-01T08:15:00Z',
    isActive: true,
  },
  {
    id: '5',
    email: 'laura.mueller@selma-druckerei.de',
    name: 'Laura Müller',
    role: 'employee',
    avatar: '',
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2023-03-15T00:00:00Z',
    lastLogin: '2024-04-29T14:20:00Z',
    isActive: true,
  },
  {
    id: '6',
    email: 'michael.weber@selma-druckerei.de',
    name: 'Michael Weber',
    role: 'employee',
    avatar: '',
    createdAt: '2023-04-05T00:00:00Z',
    updatedAt: '2023-04-05T00:00:00Z',
    lastLogin: '2024-04-28T11:30:00Z',
    isActive: true,
  },
  {
    id: '7',
    email: 'sabine.wagner@selma-druckerei.de',
    name: 'Sabine Wagner',
    role: 'manager',
    avatar: '',
    createdAt: '2023-04-15T00:00:00Z',
    updatedAt: '2023-04-15T00:00:00Z',
    lastLogin: '2024-04-30T09:45:00Z',
    isActive: true,
  },
  {
    id: '8',
    email: 'frank.becker@selma-druckerei.de',
    name: 'Frank Becker',
    role: 'employee',
    avatar: '',
    createdAt: '2023-05-01T00:00:00Z',
    updatedAt: '2023-05-01T00:00:00Z',
    lastLogin: '2024-04-25T16:20:00Z',
    isActive: true,
  },
];

// Mock-Daten für Unternehmenseinstellungen
const mockCompanySettings: CompanySettings = {
  id: '1',
  name: 'Selma Druckerei GmbH',
  address: 'Druckereistraße 1, 12345 Musterstadt',
  taxId: 'DE123456789',
  email: 'info@selma-druckerei.de',
  phone: '+49 123 456789',
  website: 'www.selma-druckerei.de',
  logo: '',
  bankAccount: {
    name: 'Sparkasse Musterstadt',
    iban: 'DE12 3456 7890 1234 5678 90',
    bic: 'SPKADE123XXX',
  },
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

// Gemeinsame Stile für die UI-Komponenten
const buttonStyles = {
  base: "inline-flex items-center justify-center transition-all duration-200 focus:outline-none",
  primary: "bg-primary hover:bg-primary-dark text-white rounded-md shadow-sm hover:shadow transform hover:scale-[1.03]",
  secondary: "border border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md shadow-sm hover:shadow transform hover:scale-[1.03]",
  icon: "text-gray-500 hover:text-primary p-1 rounded-full hover:bg-gray-100 transform hover:scale-105",
  sizes: {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'users'>('profile');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(mockCompanySettings);
  const [newUser, setNewUser] = useState<Partial<User>>({
    email: '',
    name: '',
    role: 'employee',
    isActive: true,
  });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Angenommen, der erste Benutzer ist der aktuelle Benutzer

  // Funktion zum Hinzufügen eines neuen Benutzers
  const handleAddUser = () => {
    if (!newUser.email || !newUser.name) return;

    const user: User = {
      id: `${users.length + 1}`,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as UserRole,
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    setUsers([...users, user]);
    setNewUser({
      email: '',
      name: '',
      role: 'employee',
      isActive: true,
    });
    setIsAddingUser(false);
  };

  // Funktion zum Löschen eines Benutzers
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Funktion zum Ändern des Benutzer-Status (aktiv/inaktiv)
  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  // Funktion zum Speichern der Profiländerungen
  const handleSaveProfile = () => {
    // Hier würde die API-Anfrage zum Speichern der Profiländerungen kommen
    setIsEditingProfile(false);
  };

  // Funktion zum Speichern der Unternehmenseinstellungen
  const handleSaveCompanySettings = () => {
    // Hier würde die API-Anfrage zum Speichern der Unternehmenseinstellungen kommen
    setIsEditingCompany(false);
  };

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-gray-800">Einstellungen</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-6">
            <button
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser size={iconSizes.sm} className="mr-1.5" />
              <span>Mein Profil</span>
            </button>
            <button
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                activeTab === 'company'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('company')}
            >
              <FiHome size={iconSizes.sm} className="mr-1.5" />
              <span>Unternehmen</span>
            </button>
            <button
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <FiUsers size={iconSizes.sm} className="mr-1.5" />
              <span>Mitarbeiter</span>
            </button>
          </nav>
        </div>

        {/* Profil-Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-medium text-gray-800 flex items-center">
                    <FiUser size={iconSizes.sm} className="mr-1.5 text-primary" />
                    Mein Profil
                  </h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className={`${buttonStyles.base} ${buttonStyles.icon}`}
                    title={isEditingProfile ? "Abbrechen" : "Bearbeiten"}
                  >
                    {isEditingProfile ? (
                      <FiX size={iconSizes.sm} />
                    ) : (
                      <FiEdit size={iconSizes.sm} />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-3 relative">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Profilbild" className="w-full h-full object-cover" />
                      ) : (
                        <FiUser size={iconSizes.md} className="text-gray-400" />
                      )}
                      {isEditingProfile && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200">
                          <FiUpload size={iconSizes.sm} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-800">{currentUser.name}</div>
                      <div className="text-xs text-gray-500">{currentUser.email}</div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={currentUser.name}
                          onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-sm text-gray-700">{currentUser.name}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">E-Mail</label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={currentUser.email}
                          onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-sm text-gray-700">{currentUser.email}</div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Rolle</label>
                        <div className="text-sm text-gray-700 capitalize">{currentUser.role}</div>
                      </div>

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Letzter Login</label>
                        <div className="text-xs text-gray-700">
                          {currentUser.lastLogin 
                            ? new Date(currentUser.lastLogin).toLocaleString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) 
                            : 'Keine Daten verfügbar'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleSaveProfile}
                        className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonStyles.sizes.sm}`}
                      >
                        <FiSave size={iconSizes.sm} className="mr-1" />
                        Speichern
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-medium text-gray-800 flex items-center">
                    <FiLock size={iconSizes.sm} className="mr-1.5 text-primary" />
                    Sicherheit
                  </h2>
                  <button
                    className={`${buttonStyles.base} ${buttonStyles.icon}`}
                    title="Bearbeiten"
                  >
                    <FiEdit size={iconSizes.sm} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Passwort</label>
                    <div className="text-sm text-gray-700">••••••••</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Zwei-Faktor-Authentifizierung</label>
                    <div className="text-sm text-gray-700">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-50 text-red-600">Deaktiviert</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Letztes Passwort-Update</label>
                    <div className="text-sm text-gray-700">05.03.2024</div>
                  </div>

                  <div className="flex items-center mt-1 text-xs text-gray-500 border-t border-gray-100 pt-2">
                    <FiRefreshCw size={iconSizes.sm} className="mr-1 text-gray-400" />
                    Empfohlen: Passwort alle 90 Tage ändern
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unternehmenseinstellungen-Tab */}
        {activeTab === 'company' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-medium text-gray-800 flex items-center">
                  <FiHome size={iconSizes.sm} className="mr-1.5 text-primary" />
                  Unternehmenseinstellungen
                </h2>
                <button
                  onClick={() => setIsEditingCompany(!isEditingCompany)}
                  className={`${buttonStyles.base} ${buttonStyles.icon}`}
                  title={isEditingCompany ? "Abbrechen" : "Bearbeiten"}
                >
                  {isEditingCompany ? (
                    <FiX size={iconSizes.sm} />
                  ) : (
                    <FiEdit size={iconSizes.sm} />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Firmenname</label>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companySettings.name}
                        onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-sm text-gray-700">{companySettings.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Adresse</label>
                    {isEditingCompany ? (
                      <textarea
                        value={companySettings.address}
                        onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                        rows={2}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-sm text-gray-700 whitespace-pre-line">{companySettings.address}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Steuernummer</label>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companySettings.taxId}
                        onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-sm text-gray-700">{companySettings.taxId}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">E-Mail</label>
                    {isEditingCompany ? (
                      <input
                        type="email"
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-sm text-gray-700">{companySettings.email}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Telefon</label>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-sm text-gray-700">{companySettings.phone}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companySettings.website || ''}
                        onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-sm text-gray-700">{companySettings.website || '-'}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiSettings size={iconSizes.sm} className="mr-1 text-gray-500" />
                  Bankverbindung
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Bank</label>
                      {isEditingCompany ? (
                        <input
                          type="text"
                          value={companySettings.bankAccount.name}
                          onChange={(e) => setCompanySettings({
                            ...companySettings,
                            bankAccount: {
                              ...companySettings.bankAccount,
                              name: e.target.value
                            }
                          })}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-sm text-gray-700">{companySettings.bankAccount.name}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">IBAN</label>
                      {isEditingCompany ? (
                        <input
                          type="text"
                          value={companySettings.bankAccount.iban}
                          onChange={(e) => setCompanySettings({
                            ...companySettings,
                            bankAccount: {
                              ...companySettings.bankAccount,
                              iban: e.target.value
                            }
                          })}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-sm text-gray-700">{companySettings.bankAccount.iban}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">BIC</label>
                      {isEditingCompany ? (
                        <input
                          type="text"
                          value={companySettings.bankAccount.bic}
                          onChange={(e) => setCompanySettings({
                            ...companySettings,
                            bankAccount: {
                              ...companySettings.bankAccount,
                              bic: e.target.value
                            }
                          })}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-sm text-gray-700">{companySettings.bankAccount.bic}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditingCompany && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveCompanySettings}
                    className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonStyles.sizes.sm}`}
                  >
                    <FiSave size={iconSizes.sm} className="mr-1" />
                    Speichern
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mitarbeiterverwaltung-Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium text-gray-800 flex items-center">
                <FiUsers size={iconSizes.sm} className="mr-1.5 text-primary" />
                Mitarbeiterverwaltung
              </h2>
              <button
                onClick={() => setIsAddingUser(!isAddingUser)}
                className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonStyles.sizes.sm}`}
              >
                <FiPlusCircle size={iconSizes.sm} className="mr-1" />
                Neuer Mitarbeiter
              </button>
            </div>

            {/* Formular zum Hinzufügen eines neuen Mitarbeiters */}
            {isAddingUser && (
              <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <FiUser size={iconSizes.sm} className="mr-1.5 text-primary" />
                  Neuen Mitarbeiter hinzufügen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Max Mustermann"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">E-Mail</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="max.mustermann@selma-druckerei.de"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Rolle</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Mitarbeiter</option>
                  </select>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setIsAddingUser(false)}
                    className={`${buttonStyles.base} ${buttonStyles.secondary} ${buttonStyles.sizes.sm}`}
                  >
                    <FiX size={iconSizes.sm} className="mr-1" />
                    Abbrechen
                  </button>
                  <button
                    onClick={handleAddUser}
                    className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonStyles.sizes.sm}`}
                    disabled={!newUser.email || !newUser.name}
                  >
                    <FiCheck size={iconSizes.sm} className="mr-1" />
                    Hinzufügen
                  </button>
                </div>
              </div>
            )}

            {/* Mitarbeitertabelle */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-Mail
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rolle
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Letzter Login
                      </th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aktionen
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                              {user.avatar ? (
                                <img src={user.avatar} alt="" className="h-7 w-7 rounded-full" />
                              ) : (
                                <FiUser size={iconSizes.sm} className="text-gray-400" />
                              )}
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-700">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-50 text-purple-700'
                              : user.role === 'manager'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {user.role === 'admin'
                              ? 'Admin'
                              : user.role === 'manager'
                              ? 'Manager'
                              : 'Mitarbeiter'}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full cursor-pointer transition-colors ${
                              user.isActive
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                            }`}
                          >
                            {user.isActive ? 'Aktiv' : 'Inaktiv'}
                          </button>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString('de-DE')
                            : 'Nie'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              className={`${buttonStyles.base} ${buttonStyles.icon}`}
                              title="Bearbeiten"
                            >
                              <FiEdit size={iconSizes.sm} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className={`${buttonStyles.base} ${buttonStyles.icon} ${user.id === '1' ? 'opacity-30 cursor-not-allowed' : 'text-red-500 hover:text-red-700 hover:bg-red-50'}`}
                              title="Löschen"
                              disabled={user.id === '1'} // Verhindert das Löschen des Admin-Kontos
                            >
                              <FiTrash2 size={iconSizes.sm} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SettingsPage; 