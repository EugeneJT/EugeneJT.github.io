 <?php

    $db = new PDO('mysql:host=localhost;dbname=feedback', 'root', '');
    $db->exec("SET NAMES UTF8");


    if(count($_POST) > 0) {

        $name = trim($_POST['name']);
        $email = trim($_POST['email']);
        $message = trim($_POST['message']);

        if ($name != '' && $email != '') {
            $sql = "INSERT INTO clients (name, mail, msg_user) VALUES ('$name', '$email', '$message')";

            $query = $db->prepare($sql);
            $query->execute();

            exit();
        }

    }
?>