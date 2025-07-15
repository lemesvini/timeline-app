import { useState } from 'react';

import { ContentLayout } from '@/components/layouts';
import {
  ProfileChangePassword,
  ProfileData,
  ProfileEdit,
} from '@/features/profile';

const ProfileRoute = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <ContentLayout title='Perfil do Usuário'>
      <div className='flex flex-col pb-2 items-center gap-6'>
        <div className='w-full'>
          {!isEditing && <ProfileData setIsEditing={setIsEditing} />}
          {isEditing && <ProfileEdit setIsEditing={setIsEditing} />}
        </div>
        <ProfileChangePassword />
      </div>
    </ContentLayout>
  );
};

export default ProfileRoute;
