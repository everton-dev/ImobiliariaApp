$dir = 'c:\UserData\z004stze\Documents\Private\mine\free\ImobiliariaApp\frontend\src\assets\images\properties'
$base = 'https://lzouqfwxqtorygbzmhik.supabase.co/storage/v1/object/public/imoveis-fotos'

$pairs = @(
  @('pirituba-1.jpg',  '03c51f96-40f1-474c-94d0-73421bef68c4.jpg'),
  @('pirituba-2.jpg',  'dabd4fc2-3864-4ba3-aec4-998b45f312d2.jpg'),
  @('pirituba-3.jpg',  '553ae5f8-953a-4979-afa6-fe4ea5c2ba75.jpg'),
  @('pirituba-4.jpg',  'c5e9f6de-1811-4c57-a7e2-322bf5919fb1.jpg'),
  @('pirituba-5.jpg',  '9c6b64c1-bf37-46b7-93e4-08b76e609534.jpg'),
  @('pirituba-6.jpg',  '4993c81d-6afe-4866-9bae-8609b9ffb140.jpg'),
  @('freguesia-1.jpg', '07cf0a24-04f7-42b4-b256-4131288cec1b.jpeg'),
  @('freguesia-2.jpg', 'aded9cbd-ba38-41d7-8fa0-bd7b5c254cfa.jpeg'),
  @('freguesia-3.jpg', '634fd8bf-c0b2-49b0-a733-0282a20879d9.jpeg'),
  @('freguesia-4.jpg', 'd8fe80a3-0633-490e-9006-e832e365fd4b.jpeg'),
  @('freguesia-5.jpg', 'c6307d27-567f-4480-a686-5c7e5a9e0232.jpeg')
)

$wc = New-Object System.Net.WebClient
foreach ($pair in $pairs) {
  $name = $pair[0]
  $id   = $pair[1]
  $url  = "$base/$id"
  $dest = [System.IO.Path]::Combine($dir, $name)
  try {
    $wc.DownloadFile($url, $dest)
    Write-Host "OK $name"
  } catch {
    Write-Host "FAIL $name : $_"
  }
}
$wc.Dispose()
Write-Host 'Done'
