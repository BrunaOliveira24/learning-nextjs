import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Pessoa {
    @PrimaryColumn()
    id: number;

    @Column()
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
}
