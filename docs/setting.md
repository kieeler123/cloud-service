client/
  src/
    app/
      router/
      providers/

    lib/
      firebase.ts

    features/
      drive/
        pages/
          DrivePage.tsx
          TrashPage.tsx

        components/
          FileThumbnail.tsx
          DriveUploadButton.tsx
          DriveFileList.tsx
          DriveFileRow.tsx

        hooks/
          useDriveInfiniteFiles.ts

        service/
          uploadSingleDriveFile.ts
          trashDuplicateDriveFiles.ts

        utils/
          fileDuplicate.ts
          detectDriveFileKind.ts

        types/
          driveFile.types.ts

      cloud/
        api/
          cloudFilesApi.ts

        pages/
          CloudHomePage.tsx
          CloudTrashPage.tsx

        hooks/
          useCloudFiles.ts
          useCloudTrashFiles.ts

        components/
          CloudFileList.tsx

        types/
          cloudFile.types.ts

    pages/
      LoginPage.tsx
      AccountPage.tsx

    layouts/
      AppLayout.tsx

    contexts/
      ThemeContext.tsx

    components/
      LanguageSwitcher.tsx
      ThemeSwitcher.tsx
server/
  src/
    app.ts
    index.ts

    config/
      mongodb.ts

    features/
      cloud/
        routes/
          cloudFiles.routes.ts
        repo/
          cloudFilesRepo.ts
        types/
          cloudFile.types.ts