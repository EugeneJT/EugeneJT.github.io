 <?php

    $db = new PDO('mysql:host=localhost;dbname=feedback', 'root', '');
    $db->exec("SET NAMES UTF8");


    if(count($_POST) > 0) {

        $name = trim($_POST['name']);
        $email = trim($_POST['email']);
        $message = trim($_POST['message']);

        $name = htmlspecialchars($name);
        $email = htmlspecialchars($email);
        $message = htmlspecialchars($message);


        if ($name != '' && $email != '') {
            $query = $db->prepare("INSERT INTO clients SET name=:name, mail =:email, msg_user =:message");

            $params = ['name' => $name, 'email' => $email, 'message' => $message];
            $query->execute($params);

            exit();
        }

    }
?>