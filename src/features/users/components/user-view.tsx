import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, getRoleLabel } from '@/lib/utils';
import { useGetUser } from '../api/get-user';
import {
  User,
  Mail,
  Shield,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Eye,
} from 'lucide-react';

export function UserView({ userId }: { userId: number }) {
  const userQuery = useGetUser({ userId });

  if (userQuery.isLoading) {
    return (
      <div className='flex h-48 w-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (userQuery.isError) {
    return (
      <div className='flex h-48 w-full items-center justify-center'>
        <p>Erro ao carregar usuário</p>
      </div>
    );
  }

  const user = userQuery.data;

  if (!user)
    return (
      <div className='flex h-48 w-full items-center justify-center'>
        <p>Usuário não encontrado</p>
      </div>
    );

  const {
    fullName,
    email,
    role,
    createdAt,
    emailConfirmed,
    failedLoginAttempts,
    lastLogin,
    lockUntil,
    avatarUrl,
    id,
    _id,
  } = user;

  const roleLabel = getRoleLabel(role);
  const isLocked = lockUntil && new Date(lockUntil) > new Date();

  return (
    <div className='space-y-6'>
      <Card>
        <CardContent>
          <div className='flex items-start gap-6'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className='text-lg'>
                {fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className='flex-1 space-y-3'>
              <div>
                <h1 className='text-3xl font-bold text-foreground'>
                  {fullName}
                </h1>
                <div className='flex items-center gap-2 mt-1'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <span className='text-muted-foreground'>{email}</span>
                  {emailConfirmed ? (
                    <CheckCircle className='h-4 w-4 text-green-500' />
                  ) : (
                    <XCircle className='h-4 w-4 text-destructive' />
                  )}
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Badge
                  variant={role === 'ADMINISTRATOR' ? 'default' : 'secondary'}
                  className='flex items-center gap-1'
                >
                  <Shield className='h-3 w-3' />
                  {roleLabel}
                </Badge>

                {isLocked && (
                  <Badge
                    variant='destructive'
                    className='flex items-center gap-1'
                  >
                    <Lock className='h-3 w-3' />
                    Conta Bloqueada
                  </Badge>
                )}

                <Badge variant='outline' className='flex items-center gap-1'>
                  <Eye className='h-3 w-3' />
                  ID: {id}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>
                  Email Confirmado
                </p>
                <div className='flex items-center gap-2 mt-1'>
                  {emailConfirmed ? (
                    <>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                      <span className='text-green-500'>Confirmado</span>
                    </>
                  ) : (
                    <>
                      <XCircle className='h-4 w-4 text-destructive' />
                      <span className='text-destructive'>Não Confirmado</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className='text-sm text-muted-foreground'>Data de Criação</p>
                <div className='flex items-center gap-2 mt-1'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <span>{formatDate(createdAt)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className='text-sm text-muted-foreground'>Identificadores</p>
              <div className='mt-2 space-y-1'>
                <div className='flex justify-between text-sm'>
                  <span>ID Numérico:</span>
                  <span className='font-mono'>{id}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>ID Único:</span>
                  <span className='font-mono text-xs'>{_id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Informações de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div>
                <p className='text-sm text-muted-foreground'>
                  Tentativas de Login Falhadas
                </p>
                <div className='flex items-center gap-2 mt-1'>
                  <AlertTriangle
                    className={`h-4 w-4 ${failedLoginAttempts > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}
                  />
                  <span
                    className={failedLoginAttempts > 0 ? 'text-yellow-500' : ''}
                  >
                    {failedLoginAttempts} tentativa
                    {failedLoginAttempts !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {lastLogin && (
                <div>
                  <p className='text-sm text-muted-foreground'>Último Login</p>
                  <div className='flex items-center gap-2 mt-1'>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                    <span>{formatDate(lastLogin.toString())}</span>
                  </div>
                </div>
              )}

              {lockUntil && (
                <div>
                  <p className='text-sm text-muted-foreground'>Bloqueado Até</p>
                  <div className='flex items-center gap-2 mt-1'>
                    <Lock
                      className={`h-4 w-4 ${isLocked ? 'text-destructive' : 'text-muted-foreground'}`}
                    />
                    <span className={isLocked ? 'text-destructive' : ''}>
                      {formatDate(lockUntil.toString())}
                    </span>
                  </div>
                  {isLocked && (
                    <p className='text-xs text-destructive mt-1'>
                      Esta conta está atualmente bloqueada
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
