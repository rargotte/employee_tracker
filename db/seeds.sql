INSERT INTO department (name)
VALUES ("Finance"),
       ("IT"),
       ("Logistics"),
       ("HHRR"),
       ("Marketing"),
       ("Sales");
       
INSERT INTO roles (title, salary, department_id)
VALUES ("Finance Director", 100000, 1),
       ("Finance staff", 30000, 1),
       ("IT Director", 100000, 2),
       ("Logistics Director", 100000, 3),
       ("Logistics Staff", 30000, 3),
       ("HHRR Director", 100000, 4),
       ("HHRR Staff", 30000, 4),
       ("Marketing Director", 100000, 5),
       ("Marketing Staff", 30000, 5),
       ("Sales Director", 100000, 5),
       ("Sales Staff", 30000, 5);

       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Aurelio", "Gonzalez", 1, null),
       ("Emilio", "Alvarez", 2, 1),
       ("Rita", "Dolores", 6, null),
       ("Alberto", "Alvarez", 7, 3),
       ("Xuxa", "Rapucha", 4, null),
       ("Pinto", "Salinas", 5, 5);