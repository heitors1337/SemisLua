import { getDatabase } from './connection';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  const db = getDatabase();

  try {
    // Verificar se já existem dados
    const existingUsers = await db.get('SELECT COUNT(*) as count FROM users');
    if (existingUsers.count > 0) {
      console.log('✓ Database already seeded');
      return;
    }

    console.log('🌱 Seeding database with test data...');

    // Criar usuários de teste
    const testUsers = [
      {
        email: 'user@example.com',
        password: '123456',
        name: 'João Silva',
        department: 'TI',
        role: 'employee'
      },
      {
        email: 'maria@example.com',
        password: '123456',
        name: 'Maria Santos',
        department: 'RH',
        role: 'employee'
      },
      {
        email: 'pedro@example.com',
        password: '123456',
        name: 'Pedro Costa',
        department: 'TI',
        role: 'manager'
      },
      {
        email: 'admin@example.com',
        password: '123456',
        name: 'Administrador',
        department: 'Administração',
        role: 'admin'
      },
      {
        email: 'carlos@example.com',
        password: '123456',
        name: 'Carlos Oliveira',
        department: 'Vendas',
        role: 'employee'
      },
      {
        email: 'ana@example.com',
        password: '123456',
        name: 'Ana Lima',
        department: 'Marketing',
        role: 'manager'
      },
      {
        email: 'lucas@example.com',
        password: '123456',
        name: 'Lucas Ferreira',
        department: 'TI',
        role: 'employee'
      }
    ];

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.run(
        'INSERT INTO users (email, password, name, department, role) VALUES (?, ?, ?, ?, ?)',
        [user.email, hashedPassword, user.name, user.department, user.role]
      );
    }

    console.log(`✓ Created ${testUsers.length} test users`);

    // Criar alguns feedbacks de exemplo
    const feedbacks = [
      {
        evaluator_id: 2, // Maria
        evaluated_id: 1, // João
        rating: 5,
        comment: 'Excelente profissional, muito dedicado',
        is_anonymous: 1,
        feedback_type: 'colleague'
      },
      {
        evaluator_id: 3, // Pedro (manager)
        evaluated_id: 1, // João
        rating: 4,
        comment: 'Bom desenvolvimento, pode melhorar em comunicação',
        is_anonymous: 0,
        feedback_type: 'colleague'
      },
      {
        evaluator_id: 1, // João
        evaluated_id: 3, // Pedro (manager)
        rating: 4,
        comment: 'Gestor atencioso, poderia ser mais direto',
        is_anonymous: 1,
        feedback_type: 'manager'
      },
      {
        evaluator_id: 5, // Carlos
        evaluated_id: 2, // Maria (RH)
        rating: 5,
        comment: 'Excelente suporte na resolução de problemas',
        is_anonymous: 1,
        feedback_type: 'colleague'
      }
    ];

    for (const feedback of feedbacks) {
      await db.run(
        `INSERT INTO feedbacks (evaluator_id, evaluated_id, rating, comment, is_anonymous, feedback_type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          feedback.evaluator_id,
          feedback.evaluated_id,
          feedback.rating,
          feedback.comment,
          feedback.is_anonymous,
          feedback.feedback_type
        ]
      );
    }

    console.log(`✓ Created ${feedbacks.length} test feedbacks`);
    console.log('✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('✗ Error seeding database:', error);
  }
}
