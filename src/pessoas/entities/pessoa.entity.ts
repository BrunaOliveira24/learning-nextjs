import { IsEmail } from "class-validator";
import { Recado } from "src/recados/Entities/recados.entitiy";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Pessoa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column( {length: 255})
    passwordHash: string;

    @Column({length: 100})
    nome: string;

    @CreateDateColumn()
    createAt?: Date;

    @UpdateDateColumn()
    updatedAt? : Date;


    //Uma pessoa pode ter enviado muitos recados (como 'de')
    //esses recados sao relacionados ao campo 'de' na entidade.
    @OneToMany(()=>Recado, recado => recado.de)
    recadosEnviados: Recado[]

    @OneToMany(()=>Recado, recado => recado.para)
    recadosRecebidos: Recado[];

    @Column({default:true})
    active: boolean;

    @Column({ default: '' })
    picture: string;

}
