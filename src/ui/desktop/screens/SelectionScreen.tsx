import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TopNavBar } from '../components/TopNavBar';
import { SectionCard } from '../components/SectionCard';

export function SelectionScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sections = [
    {
      id: 'media',
      title: t('home.media'),
      icon: 'images',
      onClick: () => navigate('/media'),
      disabled: false
    },
    {
      id: 'documents',
      title: t('home.documents'),
      icon: 'description',
      disabled: true
    },
    {
      id: 'backup',
      title: t('home.backup'),
      icon: 'cloud_upload',
      disabled: true
    }
  ];

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center bg-background-dark overflow-hidden p-4 tech-grid-bg">
      <TopNavBar />
      
      <main className="flex flex-1 flex-col items-center justify-center w-full max-w-6xl gap-12 pt-20">
        <div className="text-center space-y-2">
          <h1 className="text-accent-gradient text-4xl md:text-6xl font-bold tracking-tight">
            {t('common.appName')}
          </h1>
          <p className="text-text-medium text-lg max-w-2xl mx-auto font-medium tracking-tight opacity-90">
            {t('home.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              title={section.title}
              icon={section.icon}
              onClick={section.onClick}
              disabled={section.disabled}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
