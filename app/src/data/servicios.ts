export type Servicio = {
    name: string;
    price: string;
    descripcion: string;
    image: string;
  };
  
  export type CategoriaServicios = {
    category: string;
    anchor: string;
    services: Servicio[];
  };

  const servicios: CategoriaServicios[] = [
    {
      category: 'Masajes',
      anchor: 'masajes',
      services: [
        {
          name: 'Masaje Anti-stress',
          price: '$25000',
          descripcion: 'Un masaje relajante que alivia el estrés y la tensión muscular.',
          image: '/images/antistress.png',
        },
        {
          name: 'Masaje Descontructurante',
          price: '$26000',
          descripcion: 'Un masaje profundo que ayuda a liberar la tensión acumulada en los músculos.',
          image: '/images/circulatorio.png',
        },
        {
            name: 'Masaje con piedras calientes',
            price: '$30000',
            descripcion: 'Un masaje que utiliza piedras calientes para relajar los músculos y mejorar la circulación.',
            image: '/images/conpiedras.png',
          },
          {
            name: 'Masaje Circulatorio',
            price: '$28000',
            descripcion: 'Un masaje que mejora la circulación sanguínea y alivia la tensión muscular.',
            image: '/images/circulatorio.png',
          },
      ],
    },
    {
      category: 'Belleza',
      anchor: 'belleza',
      services: [
        {
          name: 'Lifting de pestañas',
          price: '$8000',
          descripcion: 'Un tratamiento que levanta y riza las pestañas.',
          image: '/images/lifting.png',
        },
        {
            name: 'Depilación facial',
            price: '$4000',
            descripcion: 'Un tratamiento de depilación para eliminar el vello facial no deseado.',
            image: '/images/depifacial.png',
          },
          {
            name: 'Belleza de manos y pies',
            price: '$30000',
            descripcion: 'Un tratamiento completo para embellecer y cuidar manos y pies.',
            image: '/images/manosypies.png',
          },
        ],
      },
      {
        category: 'Tratamientos Faciales',
        anchor: 'tratamientosfaciales',
        services: [
          {
            name: 'Punta de diamante',
            price: '$25000',
            descripcion: 'Un tratamiento de microexfoliación que elimina las células muertas y mejora la textura de la piel.',
            image: '/images/microex.png',
          },
          {
            name: 'Limpieza profunda + Hidratación',
            price: '$22000',
            descripcion: 'Un tratamiento completo que limpia profundamente la piel y la hidrata para un aspecto radiante.',
            image: '/images/hidro.png',
          },
          {
            name: 'Criofrecuencia facial',
            price: '$30000',
            descripcion: 'Un tratamiento que produce el "SHOCK TERMICO" logrando resultados instantáneos de efecto lifting.',
            image: '/images/criofacial.png',
          },
        ],
      },
      {
        category: 'Tratamientos Corporales',
        anchor: 'tratamientoscorporales',
        services: [
          {
            name: 'VelaSlim',
            price: '$35000',
            descripcion: 'Un tratamiento que utiliza calor para reducir de la circunferencia corporal y la celulitis.',
            image: '/images/velaslim.jpg',
          },
          {
            name: 'DermoHealth',
            price: '$33000',
            descripcion: 'Un tratamiento  moviliza los distintos tejidos de la piel y estimula la microcirculación, generando un drenaje linfático.',
            image: '/images/limpiezaehidrata.jpg',
          },
          {
            name: 'Criofrecuencia corporal',
            price: '$40000',
            descripcion: 'Un tratamiento que utiliza frío y calor que produce un efecto de lifting instantáneo.',
            image: '/images/manosypies.jpg',
          },
          {
            name: 'Ultracavitación',
            price: '$40000',
            descripcion: 'Un tratamiento que utiliza ultrasonido para eliminar la grasa localizada y mejorar la apariencia de la piel.',
            image: '/images/manosypies.jpg',
          },
        ],
      },
      {
        category: 'Servicios Grupales',
        anchor: 'tratamientosgrupales',
        services: [
          {
            name: 'Hidromasaje',
            price: '$20000',
            descripcion: 'El precio es por persona. Un tratamiento que utiliza agua caliente y burbujas para relajar los músculos y aliviar el estrés.',
            image: '/images/velaslim.jpg',
          },
          {
            name: 'Yoga',
            price: '$18000',
            descripcion: 'El precio es por persona. Un tratamiento que combina ejercicios de respiración y estiramiento para mejorar la flexibilidad y reducir el estrés.',
            image: '/images/limpiezaehidrata.jpg',
          },
      ],
    },
  ];
  
  export default servicios;