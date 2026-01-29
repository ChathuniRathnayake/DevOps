provider "aws" {
  region = "ap-south-1"
}

resource "null_resource" "deploy_notesapp" {
  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install docker.io -y",

      # Stop old containers if running
      "docker stop notesapp-frontend || true",
      "docker rm notesapp-frontend || true",
      "docker stop notesapp-backend || true",
      "docker rm notesapp-backend || true",

      # Run backend
      "docker run -d --restart unless-stopped -p 4000:4000 --name notesapp-backend pam2002/notesapp-backend:latest",

      # Run frontend
      "docker run -d --restart unless-stopped -p 3000:3000 --name notesapp-frontend --link notesapp-backend:backend pam2002/notesapp-frontend:latest"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"                                 # EC2 default user
      private_key = file("/var/lib/jenkins/.ssh/devops-key.pem")
      host        = "13.202.137.11"                            # EC2 public IP
    }
  }
}