// ? Titulos y Links del menú en español 
export const navItemsEs = [ "Inicio", "Institución", "Personal", "Vida escolar", "Menú cafetería", "Circulares", "Fechas importantes", "Manual ABC 22-23", "Manual Teams", "Jornalización Parvularia", "Jornalización Primaria-Secundaria", "Contáctanos" ];
export const navLinksEs = [ "/", "/institucion", "/personal", "/vida-escolar", "img/menu-cafeteria.jpg", "/circulares", "/fechas-importantes", "/assets/documents/Manual-de-convivencia-2022-2023.pdf", "/assets/documents/Manual-Teams.pdf", "/assets/documents/jornalizacion-parvularia.pdf", "/assets/documents/jornalizacion-prepa-12vo.pdf", "/contactanos" ];
export const navDropEs = [ "Menú", "Conócenos", "Información" ];

// ? Titulos y Links del menú en ingles 
export const navItemsEn = [ "Home", "Institution", "Our team", "School life", "Cafeteria menu", "Newsletter", "Important dates", "ABC manual 22-23", "Teams manual ", "Preschool Scheduling", "Primary-High School Scheduling", "Contact us" ];
export const navLinksEn = [ "/home", "/institution", "/our-team", "/school-life", "img/menu-cafeteria.jpg", "/newsletter", "/important-dates", "/assets/documents/Manual-de-convivencia-2022-2023.pdf", "/assets/documents/Manual-Teams.pdf", "/assets/documents/jornalizacion-parvularia.pdf", "/assets/documents/jornalizacion-prepa-12vo.pdf", "/contact-us" ];
export const navDropEn = ["Menu","About us","Information"];


// ? Menú de cafetería 
export const cafeteria = [
    "Semana del 5 al 9 de Septiembre",

    // *LUNES *********** 
    "Tornillos con queso.",
    // *MARTES ********** 
    "Tortitas de carne.",
    // *MIERCOLES ******* 
    "Pollo a la plancha.",
    // *JUEVES ********** 
    "Picado de verduras.",
    // *VIERNES ********* 
    "Chilaquiles con queso",

    // *--------------------------- 
    "Menú del 5 al 9 de septiembre",
    "Menu from september 5 to 9",
    "September 3, 2022"
];

export let equipos = {
    admin: {
        title: ["Personal Administrativo", "Administrative Staff"],
        eq: [
            {"nombre":"Mrs. Verónica Jordan Moore", "cargo":"PRESIDENTA JUNTA DIRECTIVA","position":"PRESIDENT BOARD OF DIRECTORS","link":"/assets/img/equipo/admin/01_Veronica_Jordan_Moore.jpg"},
            {"nombre":"Mrs. Valeria Walsh de Arias", "cargo":"DIRECTORA GENERAL","position":"PRINCIPAL","link":"/assets/img/equipo/admin/02_Valeria_Walsh_de_Arias.jpg"},
            {"nombre":"Mrs. Margarita S. de Maldonado", "cargo":"DIRECTORA ACADÉMICA","position":"ACADEMIC DIRECTOR","link":"/assets/img/equipo/admin/03_Margarita_de_Maldonado.jpg"},
            {"nombre":"Mrs. Violeta de Portillo", "cargo":"COORDINADORA GENERAL","position":"GENERAL COORDINATOR","link":"/assets/img/equipo/admin/04_Violeta_de_Portillo.jpg"},
            {"nombre":"Mr. Carlos Zavaleta", "cargo":"CONTADOR","position":"ACCOUNTANT","link":"/assets/img/equipo/admin/05_Carlos_Zavaleta.jpg"},
            {"nombre":"Ms. Karla Guerrero", "cargo":"ASISTENTE ADMINISTRATIVA","position":"ADMINISTRATIVE ASSISTANT","link":"/assets/img/equipo/admin/06_Karla_Guerrero.jpg"},
            {"nombre":"Ms. Gabriela Toledo", "cargo":"CONSEJERA ESTUDIANTIL","position":"STUDENT COUNSELOR","link":"/assets/img/equipo/admin/07_Gabriela_Toledo.jpg"}
        ]
    },
    parvu: {
        title: ["Personal de Parvularia", "Preschool Staff"],
        eq: [
            {"nombre":"Ms. Maira Gutiérrez", "cargo":"PREMATERNAL","position":"NURSERY","link":"/assets/img/equipo/parvularia/01_Maira_Gutierrez.jpg"},
            {"nombre":"Ms. Michelle Ayala", "cargo":"MATERNAL","position":"EARLY CHILDHOOD","link":"/assets/img/equipo/parvularia/02_Michelle_Ayala.jpg"},
            {"nombre":"Ms. Adriana Somoza", "cargo":"PRE KINDER A","position":"PREKINDER A","link":"/assets/img/equipo/parvularia/03_Adriana_Somoza.jpg"},
            {"nombre":"Ms. Eugenia González", "cargo":"PRE KINDER B","position":"PREKINDER B","link":"/assets/img/equipo/parvularia/04_Eugenia_Gonzalez.jpg"},
            {"nombre":"Ms. Paola Aguilar", "cargo":"KINDER A","position":"KINDER A","link":"/assets/img/equipo/parvularia/05_Paola_Aguilar.jpg"},
            {"nombre":"Ms. Adriana Avelar", "cargo":"KINDER B","position":"KINDER B","link":"/assets/img/equipo/parvularia/06_Adriana_Avelar.jpg"},
            {"nombre":"Mrs. Erika Salinas", "cargo":"PREPARATORIA A","position":"PREPARATORY A","link":"/assets/img/equipo/parvularia/07_Erika_Salinas.jpg"},
            {"nombre":"Ms. Iliana Guzmán", "cargo":"PREPARATORIA B","position":"PREPARATORY B","link":"/assets/img/equipo/parvularia/08_Iliana_Guzman.jpg"},
            {"nombre":"Ms. Gabriela Araujo", "cargo":"ASISTENTE DE KINDER A","position":"KINDER A ASSISTANT","link":"/assets/img/equipo/parvularia/09_Gabriela_Araujo.jpg"},
            {"nombre":"Ms. Fátima Rivera", "cargo":"ASISTENTE DE KINDER B","position":"KINDER B ASSISTANT","link":"/assets/img/equipo/parvularia/10_Fatima_Rivera.jpg"},
            {"nombre":"Ms. Paola López", "cargo":"ASISTENTE DE PREPARATORIA A","position":"PREPARATORY A ASSISTANT","link":"/assets/img/equipo/parvularia/11_Paola_Lopez.jpg"},
            {"nombre":"Ms. Camila Escolán", "cargo":"ASISTENTE DE PREPARATORIA B","position":"PREPARATORY B ASSISTANT","link":"/assets/img/equipo/parvularia/12_Camila_Escolan.jpg"},
            {"nombre":"Mr. Miguel Salazar", "cargo":"DEPORTE","position":"PHYSICAL EDUCATION","link":"/assets/img/equipo/parvularia/13_Miguel_Salazar.jpg"}
        ]
    },
    prima: {
        title: ["Personal de Primaria", "Primary School Staff"],
        eq: [
            {"nombre":"Ms. Ingrid Aguilera", "cargo":"1º GRADO A","position":"1st GRADE A","link":"/assets/img/equipo/primaria/01_Ingrid_Aguilera.jpg"},
            {"nombre":"Mrs. Alejandra Argueta", "cargo":"1º GRADO B","position":"1st GRADE B","link":"/assets/img/equipo/primaria/02_Alejandra_de_Salgado.jpg"},
            {"nombre":"Mrs. Tatiana de Portillo", "cargo":"2º GRADO A","position":"2nd GRADE A","link":"/assets/img/equipo/primaria/03_Tatiana_de_Portillo.jpg"},
            {"nombre":"Ms. Roxana Peñate", "cargo":"2º GRADO B","position":"2nd GRADE B","link":"/assets/img/equipo/primaria/04_Roxana_Penate.jpg"},
            {"nombre":"Mrs. María Eugenia de Calderón", "cargo":"3º GRADO A","position":"3rd GRADE A","link":"/assets/img/equipo/primaria/05_Maria_Eugenia_de_Calderon.jpg"},
            {"nombre":"Mrs. Carmen Torres", "cargo":"3º GRADO B","position":"3rd GRADE B","link":"/assets/img/equipo/primaria/06_Carmen_Torres.jpg"},
            {"nombre":"Mrs. María Begoña González", "cargo":"4º GRADO","position":"4th GRADE","link":"/assets/img/equipo/primaria/07_Maria_Begona_Gonzalez.jpg"},
            {"nombre":"Ms. Sally Ventura", "cargo":"5º GRADO","position":"5th GRADE","link":"/assets/img/equipo/primaria/08_Sally_Ventura.jpg"},
            {"nombre":"Mr. Carlos Revolorio", "cargo":"MÚSICA","position":"MUSIC","link":"/assets/img/equipo/primaria/09_Carlos_Revolorio.jpg"},
            {"nombre":"Mrs. Marielos de Walsh", "cargo":"ARTE","position":"ART","link":"/assets/img/equipo/primaria/10_Marielos_de_Walsh.jpg"},
            {"nombre":"Mr. Eduardo Solórzano", "cargo":"DEPORTE","position":"PHYSICAL EDUCATION","link":"/assets/img/equipo/primaria/11_Eduardo_Solorzano.jpg"}
        ]
    },
    secun: {
        title: ["Personal de Secundaria", "High School Staff"],
        eq: [
            {"nombre":"Ms. Galia Merino", "cargo":"6º GRADO","position":"6th GRADE","link":"/assets/img/equipo/secundaria/01_Galia_Merino.jpg"},
            {"nombre":"Mr. David Bayona", "cargo":"7º GRADO / COMPUTACIÓN","position":"7th GRADE / COMPUTER SCIENCE","link":"/assets/img/equipo/secundaria/02_David_Bayona.jpg"},
            {"nombre":"Mr. Guillermo Torres", "cargo":"8º GRADO","position":"8th GRADE","link":"/assets/img/equipo/secundaria/03_Guillermo_Torres.jpg"},
            {"nombre":"Ms. Verónica Martínez", "cargo":"9º GRADO","position":"9th GRADE","link":"/assets/img/equipo/secundaria/04_Veronica_Martinez.jpg"},
            {"nombre":"Mrs. Ana Regina Miranda", "cargo":"10º GRADO","position":"10th GRADE","link":"/assets/img/equipo/secundaria/05_Ana_Regina_Miranda.jpg"},
            {"nombre":"Mrs. Ana Gertrudis de Barrera", "cargo":"11º GRADO","position":"11th GRADE","link":"/assets/img/equipo/secundaria/06_Ana_Gertrudis_de_Barrera.jpg"},
            {"nombre":"Mr. Carlos Revolorio", "cargo":"12º GRADO","position":"12th GRADE","link":"/assets/img/equipo/secundaria/07_Carlos_Revolorio.jpg"},
            {"nombre":"Ms. Luz Cáceres", "cargo":"MAESTRA DE FRANCES","position":"FRENCH TEACHER","link":"/assets/img/equipo/secundaria/08_Luz_Caceres.jpg"},
            {"nombre":"Mr. Eduardo Santos", "cargo":"MAESTRO DE FRANCES","position":"FRENCH TEACHER","link":"/assets/img/equipo/secundaria/09_Eduardo_Santos.jpg"},
            {"nombre":"Mrs. Marielos de Walsh", "cargo":"ARTE","position":"ART","link":"/assets/img/equipo/secundaria/10_Marielos_de_Walsh.jpg"},
            {"nombre":"Mr. Eduardo Solórzano", "cargo":"DEPORTE","position":"PHYSICAL EDUCATION","link":"/assets/img/equipo/primaria/11_Eduardo_Solorzano.jpg"}
        ]
    },
    nivel: {
        title: ["Aula de Nivelación", "Development Center"],
        eq: [
            {"nombre":"Ms. Gabriela Cuellar", "cargo":"PARVULARIA","position":"PRESCHOOL","link":"/assets/img/equipo/nivelacion/01_Gabriela_Cuellar.jpg"},
            {"nombre":"Ms. Camila Ibarra", "cargo":"CICLO 1A","position":"LAVEL 1A","link":"/assets/img/equipo/nivelacion/02_Camila_Ibarra.jpg"},
            {"nombre":"Ms. Raquel Valle", "cargo":"CICLO 2A","position":"LAVEL 2A","link":"/assets/img/equipo/nivelacion/03_Raquel_Valle.jpg"},
            {"nombre":"Ms. Ariana Leonor Parrillas", "cargo":"CICLO 2B","position":"LAVEL 2B","link":"/assets/img/equipo/nivelacion/04_Ariana_Leonor_Parrillas.jpg"},
            {"nombre":"Mrs. Zuleima Navarro de Vigil", "cargo":"CICLO 3","position":"LAVEL 3","link":"/assets/img/equipo/nivelacion/05_Zuleima_Navarro_de_Vigil.jpg"},
            // {"nombre":"Ms. Eugenia González", "cargo":"ASISTENTE CICLO 1B","position":"LAVEL 1B ASSISTANT","link":"/assets/img/equipo/nivelacion/06_Eugenia_Gonzalez.jpg"}
        ]
    }
}