import { hash } from 'bcryptjs';
import { User } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

async function createAdmin() {
    try {
        // Conectar a la base de datos
        await dbConnect();

        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('Ya existe un usuario administrador');
            process.exit(0);
        }

        // Crear usuario admin
        const hashedPassword = await hash('admin123', 12);

        const admin = await User.create({
            name: 'Administrador',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Usuario administrador creado:', admin.email);
        process.exit(0);
    } catch (error) {
        console.error('Error al crear usuario administrador:', error);
        process.exit(1);
    }
}

createAdmin(); 