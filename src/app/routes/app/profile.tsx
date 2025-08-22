import { useState } from 'react';

import { ContentLayout } from '@/components/layouts';
import {
  ProfileChangePassword,
  ProfileData,
  ProfileEdit,
} from '@/features/profile';

const ProfileRoute = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  return (
    <ContentLayout title='Perfil do Usuário'>
      <div className='flex flex-col pb-2 items-center gap-6'>
        <div className='w-full'>
          {!isEditing && (
            <ProfileData
              setIsEditing={setIsEditing}
              setIsChangingPassword={setIsChangingPassword}
              isChangingPassword={isChangingPassword}
            />
          )}

          {isEditing && <ProfileEdit setIsEditing={setIsEditing} />}
        </div>
        {isChangingPassword && (
          <ProfileChangePassword
            key='change-password'
            setIsChangingPassword={setIsChangingPassword}
          />
        )}
      </div>
    </ContentLayout>
  );
};

export default ProfileRoute;
