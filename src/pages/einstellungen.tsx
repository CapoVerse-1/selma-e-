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
  FiHome
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Einstellungen</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <div className="flex items-center">
                <FiUser className="mr-2" />
                Mein Profil
              </div>
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'company'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('company')}
            >
              <div className="flex items-center">
                <FiHome className="mr-2" />
                Unternehmenseinstellungen
              </div>
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <div className="flex items-center">
                <FiUsers className="mr-2" />
                Mitarbeiterverwaltung
              </div>
            </button>
          </nav>
        </div>

        {/* Profil-Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Mein Profil</h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="btn btn-outline flex items-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-105 rounded-md px-3 py-1 border border-gray-300 text-sm"
                  >
                    {isEditingProfile ? (
                      <>
                        <FiX className="mr-1" />
                        Abbrechen
                      </>
                    ) : (
                      <>
                        <FiEdit className="mr-1" />
                        Bearbeiten
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={currentUser.name}
                          onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-gray-900">{currentUser.name}</div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={currentUser.email}
                          onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-gray-900">{currentUser.email}</div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <div className="mb-4 flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                        <div className="text-gray-900 capitalize">{currentUser.role}</div>
                      </div>

                      <div className="mb-4 flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Letzter Login</label>
                        <div className="text-gray-900 text-sm">
                          {currentUser.lastLogin 
                            ? new Date(currentUser.lastLogin).toLocaleString('de-DE') 
                            : 'Keine Daten verfügbar'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-start">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4 relative">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Profilbild" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400">
                          <FiUser size={24} />
                        </span>
                      )}
                      {isEditingProfile && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <button className="text-white flex items-center justify-center p-1 rounded-full bg-gray-800 hover:bg-gray-700">
                            <FiUpload size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {isEditingProfile ? "Klicken, um Profilbild zu ändern" : currentUser.name}
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleSaveProfile}
                        className="ml-3 btn bg-primary hover:bg-primary-dark text-white rounded-md px-3 py-1 transition-all duration-300 ease-in-out hover:shadow-md flex items-center text-sm"
                      >
                        <FiSave className="mr-1" />
                        Speichern
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Zweites Panel für Demonstration - kann entfernt oder angepasst werden */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Sicherheitseinstellungen</h2>
                  <button
                    className="btn btn-outline flex items-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-105 rounded-md px-3 py-1 border border-gray-300 text-sm"
                  >
                    <FiEdit className="mr-1" />
                    Bearbeiten
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
                      <div className="text-gray-900">••••••••</div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zwei-Faktor-Authentifizierung</label>
                      <div className="text-gray-900">Deaktiviert</div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Letztes Passwort-Update</label>
                      <div className="text-gray-900">05.03.2024</div>
                    </div>
                  </div>

                  <div className="flex items-center mt-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-4">
                      <FiRefreshCw size={24} className="text-gray-400" />
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Empfohlen: Passwort alle 90 Tage ändern
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unternehmenseinstellungen-Tab */}
        {activeTab === 'company' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Unternehmenseinstellungen</h2>
                <button
                  onClick={() => setIsEditingCompany(!isEditingCompany)}
                  className="btn btn-outline flex items-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-105 rounded-md px-4 py-2 border border-gray-300"
                >
                  {isEditingCompany ? (
                    <>
                      <FiX className="mr-2" />
                      Abbrechen
                    </>
                  ) : (
                    <>
                      <FiEdit className="mr-2" />
                      Bearbeiten
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Firmenname</label>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companySettings.name}
                        onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-gray-900">{companySettings.name}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    {isEditingCompany ? (
                      <textarea
                        value={companySettings.address}
                        onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-gray-900 whitespace-pre-line">{companySettings.address}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Steuernummer</label>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companySettings.taxId}
                        onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-gray-900">{companySettings.taxId}</div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                    {isEditingCompany ? (
                      <input
                        type="email"
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-gray-900">{companySettings.email}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-gray-900">{companySettings.phone}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companySettings.website || ''}
                        onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <div className="text-gray-900">{companySettings.website || '-'}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bankverbindung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
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
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-gray-900">{companySettings.bankAccount.name}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
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
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-gray-900">{companySettings.bankAccount.iban}</div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">BIC</label>
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
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <div className="text-gray-900">{companySettings.bankAccount.bic}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditingCompany && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveCompanySettings}
                    className="ml-3 btn bg-primary hover:bg-primary-dark text-white rounded-md px-4 py-2 transition-all duration-300 ease-in-out hover:shadow-md flex items-center"
                  >
                    <FiSave className="mr-2" />
                    Änderungen speichern
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mitarbeiterverwaltung-Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Mitarbeiterverwaltung</h2>
              <button
                onClick={() => setIsAddingUser(!isAddingUser)}
                className="btn bg-primary hover:bg-primary-dark text-white rounded-md px-4 py-2 transition-all duration-300 ease-in-out hover:shadow-md flex items-center"
              >
                <FiPlusCircle className="mr-2" />
                Neuer Mitarbeiter
              </button>
            </div>

            {/* Formular zum Hinzufügen eines neuen Mitarbeiters */}
            {isAddingUser && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Neuen Mitarbeiter hinzufügen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Max Mustermann"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="max.mustermann@selma-druckerei.de"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Mitarbeiter</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAddingUser(false)}
                    className="btn btn-outline flex items-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md rounded-md px-4 py-2 border border-gray-300"
                  >
                    <FiX className="mr-2" />
                    Abbrechen
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="btn bg-primary hover:bg-primary-dark text-white rounded-md px-4 py-2 transition-all duration-300 ease-in-out hover:shadow-md flex items-center"
                    disabled={!newUser.email || !newUser.name}
                  >
                    <FiCheck className="mr-2" />
                    Hinzufügen
                  </button>
                </div>
              </div>
            )}

            {/* Mitarbeitertabelle */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-Mail
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rolle
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Letzter Login
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aktionen
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {user.avatar ? (
                                <img src={user.avatar} alt="" className="h-10 w-10 rounded-full" />
                              ) : (
                                <span className="text-gray-500">
                                  <FiUser />
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'manager'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'admin'
                              ? 'Administrator'
                              : user.role === 'manager'
                              ? 'Manager'
                              : 'Mitarbeiter'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            } cursor-pointer transition-colors hover:bg-opacity-80`}
                          >
                            {user.isActive ? 'Aktiv' : 'Inaktiv'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString('de-DE')
                            : 'Nie'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Bearbeiten"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Löschen"
                              disabled={user.id === '1'} // Verhindert das Löschen des Admin-Kontos
                            >
                              <FiTrash2 size={18} className={user.id === '1' ? 'opacity-30 cursor-not-allowed' : ''} />
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