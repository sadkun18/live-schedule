import { getAdmins } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createAdminAction, deleteAdminAction } from '../../actions';
import { Trash2 } from 'lucide-react';

export default async function AdminsPage() {
  await requireAdmin();
  const admins = getAdmins();

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Kelola Admin</h1>

      <form action={createAdminAction} className='bg-white p-6 rounded-2xl shadow-sm space-y-4'>
        <h2 className='font-semibold'>Tambah Admin Baru</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input label='Nama' name='name' required />
          <Input label='PIN Baru' name='pin' type='password' required />
        </div>
        <Button type='submit'>Tambah Admin</Button>
      </form>

      <div className='bg-white p-6 rounded-2xl shadow-sm'>
        <h2 className='font-semibold mb-4'>Daftar Admin</h2>
        <ul className='space-y-2'>
          {admins.map((admin) => (
            <li key={admin.id} className='flex items-center justify-between p-3 bg-zinc-50 rounded-xl'>
              <span>{admin.name}</span>
              <form action={deleteAdminAction}>
                <input type='hidden' name='id' value={admin.id} />
                <Button type='submit' variant='danger' size='sm'>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
