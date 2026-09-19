/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveScreen, StudioPhoto, UserProfile } from './types';
import { INITIAL_PHOTOS, INITIAL_USER } from './data';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { EditorView } from './components/EditorView';
import { ExportView } from './components/ExportView';
import { AuthView } from './components/AuthView';
import { CatalogView } from './components/CatalogView';
import { PresetsView } from './components/PresetsView';
import { SettingsView } from './components/SettingsView';
import { StoreSwitcherModal, UpgradeModal } from './components/Modals';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('dashboard');
  const [photos, setPhotos] = useState<StudioPhoto[]>(INITIAL_PHOTOS);
  const [activePhoto, setActivePhoto] = useState<StudioPhoto>(INITIAL_PHOTOS[0]);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Handlers
  const handleSelectPhotoForEdit = (photo: StudioPhoto) => {
    setActivePhoto(photo);
    setCurrentScreen('editor');
  };

  const handleUpdatePhoto = (updated: StudioPhoto) => {
    setActivePhoto(updated);
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddNewPhoto = (newPhoto: StudioPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
    setUser((prev) => ({
      ...prev,
      usedCredits: Math.min(prev.totalCredits, prev.usedCredits + 1),
    }));
  };

  const handleApplyPresetGlobally = (presetName: string, contrast: number, sat: number) => {
    setActivePhoto((prev) => ({
      ...prev,
      presetApplied: presetName,
      contrast,
      saturation: sat,
      status: 'edited',
    }));
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === activePhoto.id
          ? { ...p, presetApplied: presetName, contrast, saturation: sat, status: 'edited' }
          : p
      )
    );
  };

  const handleUpgradeSuccess = () => {
    setUser((prev) => ({
      ...prev,
      tier: 'StudioDrop Unlimited Plan',
      totalCredits: 9999,
    }));
  };

  return (
    <div className="min-h-screen bg-[#fcf8f9] text-[#1c1b1c] flex flex-col selection:bg-[#ffd9e0] selection:text-[#701738]">
      {/* Top persistent Header (hidden only in blank auth mode) */}
      {currentScreen !== 'auth' && (
        <Header
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          user={user}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 w-full flex flex-col ${currentScreen !== 'auth' ? 'pt-16' : ''}`}>
        <AnimatePresence mode="wait">
          {currentScreen === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <DashboardView
                photos={photos}
                user={user}
                onSelectPhotoForEdit={handleSelectPhotoForEdit}
                onAddNewPhoto={handleAddNewPhoto}
                onUpgradeClick={() => setUpgradeModalOpen(true)}
                onOpenStoreSwitch={() => setStoreModalOpen(true)}
              />
            </motion.div>
          )}

          {currentScreen === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <EditorView
                photo={activePhoto}
                onUpdatePhoto={handleUpdatePhoto}
                onBack={() => setCurrentScreen('dashboard')}
                onProceedToExport={() => setCurrentScreen('export')}
              />
            </motion.div>
          )}

          {currentScreen === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <ExportView
                photo={activePhoto}
                onBackToEditor={() => setCurrentScreen('editor')}
                onDoneToDashboard={() => setCurrentScreen('dashboard')}
              />
            </motion.div>
          )}

          {currentScreen === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <AuthView
                user={user}
                onLoginSuccess={(updatedUser) => {
                  setUser((prev) => ({ ...prev, ...updatedUser }));
                  setCurrentScreen('dashboard');
                }}
                onClose={() => setCurrentScreen('dashboard')}
              />
            </motion.div>
          )}

          {currentScreen === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <CatalogView
                photos={photos}
                onSelectPhoto={handleSelectPhotoForEdit}
                onAddNewPhotoClick={() => setCurrentScreen('dashboard')}
              />
            </motion.div>
          )}

          {currentScreen === 'presets' && (
            <motion.div
              key="presets"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <PresetsView
                onApplyPresetToPhoto={handleApplyPresetGlobally}
                photos={photos}
              />
            </motion.div>
          )}

          {currentScreen === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <SettingsView
                user={user}
                onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
                onSignOut={() => setCurrentScreen('auth')}
                onUpgradeClick={() => setUpgradeModalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Navigation for top-level tabs */}
      {(currentScreen === 'dashboard' ||
        currentScreen === 'catalog' ||
        currentScreen === 'presets' ||
        currentScreen === 'settings') && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      )}

      {/* Dialog Modals */}
      <StoreSwitcherModal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        currentStore={user.storeName}
        onSelectStore={(storeName) => setUser((prev) => ({ ...prev, storeName }))}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        user={user}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
    </div>
  );
}
