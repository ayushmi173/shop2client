import { PrismaClient, UserRole, VerificationStatus, DayOfWeek } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================
  // PROFESSIONS
  // ============================================
  const professions = await Promise.all([
    prisma.profession.upsert({
      where: { slug: 'plumber' },
      update: {},
      create: {
        name: 'Plumber',
        slug: 'plumber',
        description: 'Expert in fixing pipes, faucets, and water systems',
        categoryGroup: 'Home Services',
        iconUrl: '/icons/plumber.svg',
        displayOrder: 1,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'electrician' },
      update: {},
      create: {
        name: 'Electrician',
        slug: 'electrician',
        description: 'Handles electrical wiring, repairs, and installations',
        categoryGroup: 'Home Services',
        iconUrl: '/icons/electrician.svg',
        displayOrder: 2,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'carpenter' },
      update: {},
      create: {
        name: 'Carpenter',
        slug: 'carpenter',
        description: 'Woodwork, furniture repair, and custom installations',
        categoryGroup: 'Home Services',
        iconUrl: '/icons/carpenter.svg',
        displayOrder: 3,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'painter' },
      update: {},
      create: {
        name: 'Painter',
        slug: 'painter',
        description: 'Interior and exterior painting services',
        categoryGroup: 'Home Services',
        iconUrl: '/icons/painter.svg',
        displayOrder: 4,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'mechanic' },
      update: {},
      create: {
        name: 'Mechanic',
        slug: 'mechanic',
        description: 'Vehicle repair and maintenance',
        categoryGroup: 'Vehicle Services',
        iconUrl: '/icons/mechanic.svg',
        displayOrder: 5,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'maid' },
      update: {},
      create: {
        name: 'Maid / House Helper',
        slug: 'maid',
        description: 'Household cleaning and daily chores',
        categoryGroup: 'Personal Services',
        iconUrl: '/icons/maid.svg',
        displayOrder: 6,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'cook' },
      update: {},
      create: {
        name: 'Cook',
        slug: 'cook',
        description: 'Home cooking and meal preparation',
        categoryGroup: 'Personal Services',
        iconUrl: '/icons/cook.svg',
        displayOrder: 7,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'milkman' },
      update: {},
      create: {
        name: 'Milkman',
        slug: 'milkman',
        description: 'Daily milk and dairy delivery',
        categoryGroup: 'Daily Essentials',
        iconUrl: '/icons/milkman.svg',
        displayOrder: 8,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'garbage-collector' },
      update: {},
      create: {
        name: 'Garbage Collector',
        slug: 'garbage-collector',
        description: 'Waste collection and disposal',
        categoryGroup: 'Daily Essentials',
        iconUrl: '/icons/garbage.svg',
        displayOrder: 9,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'laundry' },
      update: {},
      create: {
        name: 'Laundry / Dhobi',
        slug: 'laundry',
        description: 'Clothes washing and ironing',
        categoryGroup: 'Personal Services',
        iconUrl: '/icons/laundry.svg',
        displayOrder: 10,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'gardener' },
      update: {},
      create: {
        name: 'Gardener',
        slug: 'gardener',
        description: 'Garden maintenance and landscaping',
        categoryGroup: 'Home Services',
        iconUrl: '/icons/gardener.svg',
        displayOrder: 11,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'ac-technician' },
      update: {},
      create: {
        name: 'AC Technician',
        slug: 'ac-technician',
        description: 'Air conditioner installation, repair, and servicing',
        categoryGroup: 'Home Services',
        iconUrl: '/icons/ac.svg',
        displayOrder: 12,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'driver' },
      update: {},
      create: {
        name: 'Driver',
        slug: 'driver',
        description: 'Personal or commercial driving services',
        categoryGroup: 'Transport',
        iconUrl: '/icons/driver.svg',
        displayOrder: 13,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'security-guard' },
      update: {},
      create: {
        name: 'Security Guard',
        slug: 'security-guard',
        description: 'Property and personal security',
        categoryGroup: 'Security',
        iconUrl: '/icons/security.svg',
        displayOrder: 14,
      },
    }),
    prisma.profession.upsert({
      where: { slug: 'tutor' },
      update: {},
      create: {
        name: 'Tutor',
        slug: 'tutor',
        description: 'Home tutoring and educational support',
        categoryGroup: 'Education',
        iconUrl: '/icons/tutor.svg',
        displayOrder: 15,
      },
    }),
  ]);

  console.log(`✅ Created ${professions.length} professions`);

  // ============================================
  // ADMIN USER
  // ============================================
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { phone: '+911234567890' },
    update: {},
    create: {
      phone: '+911234567890',
      phoneVerified: true,
      email: 'admin@localconnect.com',
      emailVerified: true,
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // ============================================
  // SAMPLE USERS
  // ============================================
  const user1 = await prisma.user.upsert({
    where: { phone: '+919876543210' },
    update: {},
    create: {
      phone: '+919876543210',
      phoneVerified: true,
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: UserRole.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { phone: '+919876543211' },
    update: {},
    create: {
      phone: '+919876543211',
      phoneVerified: true,
      firstName: 'Priya',
      lastName: 'Patel',
      role: UserRole.USER,
    },
  });

  // Create locations for users
  await prisma.location.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      latitude: 28.6139,
      longitude: 77.2090,
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110001',
      formattedAddress: 'Connaught Place, New Delhi, Delhi 110001',
    },
  });

  await prisma.location.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      latitude: 19.0760,
      longitude: 72.8777,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      formattedAddress: 'Fort, Mumbai, Maharashtra 400001',
    },
  });

  console.log(`✅ Created ${2} sample users with locations`);

  // ============================================
  // SAMPLE WORKERS
  // ============================================
  const workerData = [
    {
      phone: '+919111111111',
      firstName: 'Ramesh',
      lastName: 'Kumar',
      bio: 'Experienced plumber with 10+ years in residential and commercial plumbing',
      experience: 10,
      serviceRadius: 8,
      hourlyRate: 300,
      professionSlugs: ['plumber'],
      latitude: 28.6280,
      longitude: 77.2183,
      city: 'New Delhi',
      rating: 4.7,
      completedJobs: 156,
    },
    {
      phone: '+919111111112',
      firstName: 'Suresh',
      lastName: 'Electricals',
      bio: 'Certified electrician specializing in home wiring and appliance repair',
      experience: 8,
      serviceRadius: 10,
      hourlyRate: 350,
      professionSlugs: ['electrician', 'ac-technician'],
      latitude: 28.5672,
      longitude: 77.2100,
      city: 'New Delhi',
      rating: 4.8,
      completedJobs: 234,
    },
    {
      phone: '+919111111113',
      firstName: 'Lakshmi',
      lastName: 'Devi',
      bio: 'Reliable house helper with experience in cooking and cleaning',
      experience: 5,
      serviceRadius: 5,
      hourlyRate: 200,
      professionSlugs: ['maid', 'cook'],
      latitude: 28.6350,
      longitude: 77.2250,
      city: 'New Delhi',
      rating: 4.9,
      completedJobs: 89,
    },
    {
      phone: '+919111111114',
      firstName: 'Mohammed',
      lastName: 'Salim',
      bio: 'Expert mechanic for all types of two-wheelers and four-wheelers',
      experience: 15,
      serviceRadius: 12,
      hourlyRate: 400,
      professionSlugs: ['mechanic'],
      latitude: 19.0820,
      longitude: 72.8810,
      city: 'Mumbai',
      rating: 4.6,
      completedJobs: 312,
    },
    {
      phone: '+919111111115',
      firstName: 'Sunita',
      lastName: 'Verma',
      bio: 'Professional painter with expertise in interior and exterior painting',
      experience: 7,
      serviceRadius: 15,
      hourlyRate: 350,
      professionSlugs: ['painter'],
      latitude: 19.0720,
      longitude: 72.8650,
      city: 'Mumbai',
      rating: 4.5,
      completedJobs: 78,
    },
  ];

  for (const data of workerData) {
    const worker = await prisma.user.upsert({
      where: { phone: data.phone },
      update: {},
      create: {
        phone: data.phone,
        phoneVerified: true,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.WORKER,
      },
    });

    // Create location
    await prisma.location.upsert({
      where: { userId: worker.id },
      update: {},
      create: {
        userId: worker.id,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        state: data.city === 'New Delhi' ? 'Delhi' : 'Maharashtra',
        country: 'India',
      },
    });

    // Calculate trust score: (rating * 0.6) + (completed_jobs_normalized * 0.3) + (verification * 0.1)
    const normalizedJobs = Math.min(data.completedJobs / 100, 1) * 5;
    const verificationScore = 5; // Verified
    const trustScore = (data.rating * 0.6) + (normalizedJobs * 0.3) + (verificationScore * 0.1);

    // Create worker profile
    const workerProfile = await prisma.workerProfile.upsert({
      where: { userId: worker.id },
      update: {},
      create: {
        userId: worker.id,
        bio: data.bio,
        experience: data.experience,
        serviceRadius: data.serviceRadius,
        hourlyRate: data.hourlyRate,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
        totalJobs: data.completedJobs + Math.floor(Math.random() * 20),
        completedJobs: data.completedJobs,
        averageRating: data.rating,
        totalReviews: Math.floor(data.completedJobs * 0.7),
        trustScore: parseFloat(trustScore.toFixed(2)),
        isAvailable: true,
        profileComplete: true,
      },
    });

    // Link professions
    for (const slug of data.professionSlugs) {
      const profession = professions.find(p => p.slug === slug);
      if (profession) {
        await prisma.workerProfession.upsert({
          where: {
            workerId_professionId: {
              workerId: workerProfile.id,
              professionId: profession.id,
            },
          },
          update: {},
          create: {
            workerId: workerProfile.id,
            professionId: profession.id,
            isPrimary: data.professionSlugs.indexOf(slug) === 0,
            yearsExperience: data.experience,
          },
        });
      }
    }

    // Create availability slots (Mon-Sat, 9am-6pm)
    const workDays = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY];
    for (const day of workDays) {
      await prisma.availabilitySlot.create({
        data: {
          workerId: workerProfile.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isActive: true,
        },
      });
    }

    // Add worker tags
    const tags = ['Reliable', 'Punctual'];
    if (data.rating >= 4.7) tags.push('Top Rated');
    if (data.completedJobs > 100) tags.push('Experienced');
    
    for (const tag of tags) {
      await prisma.workerTag.upsert({
        where: {
          workerId_tag: {
            workerId: workerProfile.id,
            tag,
          },
        },
        update: {},
        create: {
          workerId: workerProfile.id,
          tag,
          isAutomatic: true,
          score: data.rating,
        },
      });
    }
  }

  console.log(`✅ Created ${workerData.length} sample workers with profiles`);

  // ============================================
  // FEATURE FLAGS
  // ============================================
  await prisma.featureFlag.upsert({
    where: { name: 'monetization' },
    update: {},
    create: {
      name: 'monetization',
      description: 'Enable premium features and monetization',
      isEnabled: false,
      enabledCities: ['Mumbai', 'Delhi', 'Bangalore'],
      enabledPercent: 0,
    },
  });

  await prisma.featureFlag.upsert({
    where: { name: 'instant_booking' },
    update: {},
    create: {
      name: 'instant_booking',
      description: 'Allow instant booking without worker confirmation',
      isEnabled: true,
      enabledCities: [],
      enabledPercent: 100,
    },
  });

  await prisma.featureFlag.upsert({
    where: { name: 'ai_recommendations' },
    update: {},
    create: {
      name: 'ai_recommendations',
      description: 'AI-powered worker recommendations',
      isEnabled: false,
      enabledCities: [],
      enabledPercent: 10,
    },
  });

  console.log(`✅ Created feature flags`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
