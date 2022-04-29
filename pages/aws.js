import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Head from 'next/Head'
import Image from 'next/Image'

export default function awsNotes() {
  return (
    <div className={styles.container}>
      <Head>
        <title>AWS Notes</title>
        <meta name="description" content="AWS Notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          AWS Notes
        </h1>

        <p className={styles.description}>
          * [Module 1: The Cloud](/AWS/module1_cloud_concepts/notes_on_cloud_concepts)
          * [Module 2: Economics](/AWS/module2_cloud_economics_billing/notes_pricing)
          * [Module 3: AWS Infrastructure](/AWS/module3_global_infrastructure/notes_global_infrastructure)
          * [Module 4: Cloud security](/AWS/module4_cloud_security/notes_cloud_security)

          Module 5: Networking

          * [Networking](/AWS/module5_networking/notes_networking.md)
          * [CLoudFront](/AWS/module5_networking/notes_cloudfront.md)
          * [Route53](/AWS/module5_networking/notes_route53.md)

          Module 6: Compute Services

          * [EC2](/AWS/module6_compute/notes_compute.md)
          * [Containers](/AWS/module6_compute/notes_containers.md)
          * [Elastic Beanstalk](/AWS/module6_compute/notes_elastic_beanstalk.md)
          * [AWS Lambda](/AWS/module6_compute/notes_lambda.md)

          Module 7: Storage services

          * [S3](/AWS/module7_storage/notes_s3.md)
          * [Elastic Block Store (EBS)](/AWS/module7_storage/notes_ebs.md)
          * [Elastic File System (EFS)](/AWS/module7_storage/notes_efs.md)
          * [S3 Glacier](/AWS/module7_storage/notes_s3_glacier.md)

          Module 8: Database services

          * [RDS](/AWS/module8_database/amazon_rds.md)
          * [Aurora](/AWS/module8_database/aurora.md)
          * [DynamoDB](/AWS/module8_database/dynamo_db.md)
          * [Redshift](/AWS/module8_database/redshift.md)
          * [How to choose?](/AWS/module8_database/selecting_a_database_service.md)

          Module 9: Cloud Architecture

          * [AWS Well-Architected Framework](/AWS/module9_cloud_architecture/notes_cloud_architecture.md)
          * [High availability](/AWS/module9_cloud_architecture/high_availability.md)

          Module 10: Auto scaling and Monitoring
        </p>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}